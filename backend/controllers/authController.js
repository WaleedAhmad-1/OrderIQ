const prisma = require('../config/db');

/**
 * Helper to generate a personalized referral code (e.g., WALEED782)
 */
const generateUniqueReferralCode = async (fullName) => {
    const firstName = fullName.split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '');
    let code;
    let isUnique = false;

    while (!isUnique) {
        const randomNum = Math.floor(100 + Math.random() * 900);
        code = `${firstName}${randomNum}`;

        const existing = await prisma.user.findUnique({
            where: { referralCode: code }
        });

        if (!existing) isUnique = true;
    }
    return code;
};

/**
 * @desc    Register user in Postgres after Firebase signup
 * @route   POST /api/auth/register
 * @access  Public (But requires a valid Firebase ID Token in body or header)
 */
exports.register = async (req, res) => {
    try {
        const { firebaseUid, email, fullName, phone, role, referralCode: usedReferralCode } = req.body;

        if (!firebaseUid || !email || !fullName) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }

        // Phone validation (numeric, 10-15 digits, optional +)
        if (phone) {
            const phoneRegex = /^\+?[\d\s-]{10,15}$/;
            if (!phoneRegex.test(phone)) {
                return res.status(400).json({ success: false, message: 'Please provide a valid phone number' });
            }
        }

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { firebaseUid }
                ]
            }
        });

        if (existingUser) {
            // Check if it's the SAME user (ID and UID match or UID matches)
            // If UID matches, we can safely treat this as a "success" (maybe they refreshed or clicked twice)
            if (existingUser.firebaseUid === firebaseUid) {
                console.log('[AuthController] User already exists with matching UID, returning success.');
                return res.status(200).json({ 
                    success: true, 
                    message: 'User already registered',
                    data: { id: existingUser.id, email: existingUser.email, fullName: existingUser.fullName, role: existingUser.role }
                });
            }
            return res.status(400).json({ success: false, message: 'An account with this email/UID already exists' });
        }

        const referralCode = await generateUniqueReferralCode(fullName);

        // Handle referral logic
        let referrer = null;
        let pointsToAward = 0;

        if (usedReferralCode && usedReferralCode.trim()) {
            const cleanedCode = usedReferralCode.trim().toUpperCase();
            referrer = await prisma.user.findUnique({
                where: { referralCode: cleanedCode }
            });

            if (referrer) {
                pointsToAward = 100; // Reward for the new user
            }
        }

        // Create user in PostgreSQL
        const user = await prisma.user.create({
            data: {
                firebaseUid,
                email,
                fullName,
                phone,
                role: role || 'CUSTOMER',
                referralCode,
                rewardPoints: pointsToAward
            }
        });

        // Handle referral logic (Non-blocking reward phase)
        if (usedReferralCode && usedReferralCode.trim()) {
            try {
                const cleanedCode = usedReferralCode.trim().toUpperCase();
                const referrer = await prisma.user.findUnique({
                    where: { referralCode: cleanedCode }
                });

                if (referrer) {
                    console.log(`[AuthController] Valid Referral: ${cleanedCode}. Awarding points.`);

                    // 1. Update referrer's points
                    await prisma.user.update({
                        where: { id: referrer.id },
                        data: { rewardPoints: { increment: 100 } }
                    });

                    // 2. Award points to new user (they were already created at line 76 with pointsToAward)
                    // Wait, if pointsToAward was set, line 76 already has it.
                    // But we double check the records creation here.

                    // 3. Create reward record for referrer
                    await prisma.reward.create({
                        data: {
                            userId: referrer.id,
                            points: 100,
                            type: 'EARNED',
                            source: 'Referral',
                            description: `Referral reward for inviting ${user.fullName}`
                        }
                    });

                    // 4. Create reward record for new user
                    await prisma.reward.create({
                        data: {
                            userId: user.id,
                            points: 100,
                            type: 'EARNED',
                            source: 'Referral',
                            description: `Welcome bonus for using referral code: ${cleanedCode}`
                        }
                    });
                    console.log('[AuthController] Reward records created successfully.');
                }
            } catch (rewardError) {
                console.error('[AuthController] Non-blocking reward error:', rewardError.message);
                // We DON'T throw here. Registration continues.
            }
        }

        res.status(201).json({
            success: true,
            data: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            }
        });
    } catch (error) {
        // Handle Race Condition: Middleware auto-sync created the user at theเดียวกัน same time
        if (error.code === 'P2002' && (error.meta?.target?.includes('firebaseUid') || error.meta?.target?.includes('email'))) {
            console.log('[AuthController] Handled race condition: User created by parallel request.');
            let existing = await prisma.user.findFirst({ 
                where: { OR: [{ firebaseUid }, { email }] }
            });

            if (existing) {
                // IMPORTANT: If the role was auto-synced as 'CUSTOMER' but this is a 'RESTAURANT_OWNER' signup, 
                // we MUST update the role so the user has permissions for the next step.
                if (role && existing.role !== role) {
                    console.log(`[AuthController] Syncing role: ${existing.role} -> ${role}`);
                    existing = await prisma.user.update({
                        where: { id: existing.id },
                        data: { role: role }
                    });
                }

                return res.status(200).json({
                    success: true,
                    message: 'User registered via sync' + (existing.role === role ? '' : ' & role updated'),
                    data: { id: existing.id, email: existing.email, fullName: existing.fullName, role: existing.role }
                });
            }
        }

        console.error('Registration Error:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during registration',
            error: error.message 
        });
    }
};

/**
 * @desc    Get current logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
    try {
        // req.user is populated by the protect middleware
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            include: {
                addresses: true // Include addresses if customer
            }
        });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('GetMe Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
