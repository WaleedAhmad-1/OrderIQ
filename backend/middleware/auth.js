const { admin, isInitialized } = require('../config/firebase');
const prisma = require('../config/db');

/**
 * Protect middleware
 * Verifies the Firebase ID token in the Authorization header.
 * If valid, fetches the user from PostgreSQL and attaches `req.user`.
 */
exports.protect = async (req, res, next) => {
    try {
        if (!isInitialized) {
            return res.status(500).json({ success: false, message: 'Firebase Admin not configured on server' });
        }

        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
        }

        // Verify token using Firebase Admin
        const decodedToken = await admin.auth().verifyIdToken(token);

        // Determine role from Firebase custom claims (set by createAdmin script or admin SDK)
        const claimsRole = decodedToken.role || (decodedToken.admin === true ? 'ADMIN' : null);

        // Find the user in our PostgreSQL database using the Firebase UID
        let user = await prisma.user.findUnique({
            where: { firebaseUid: decodedToken.uid }
        });

        if (!user) {
            // Lazy sync: user exists in Firebase but not in our DB (likely after a reset)
            try {
                const referralCode = `REF-${decodedToken.uid.substring(0, 5).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
                // Use role from Firebase custom claims if available, otherwise default to CUSTOMER
                const syncRole = claimsRole || 'CUSTOMER';
                user = await prisma.user.create({
                    data: {
                        firebaseUid: decodedToken.uid,
                        email: decodedToken.email,
                        fullName: decodedToken.name || decodedToken.email.split('@')[0],
                        role: syncRole,
                        referralCode: referralCode
                    }
                });
                console.log(`[Auth] Lazy-syncing new user: ${decodedToken.email}. Role: ${syncRole}. UID: ${decodedToken.uid}`);
            } catch (createError) {
                // Handle Race Condition: User created by parallel request (e.g. register endpoint)
                if (createError.code === 'P2002') {
                    console.log(`[Auth] Handled race condition: user already created. UID: ${decodedToken.uid}`);
                    user = await prisma.user.findUnique({
                        where: { firebaseUid: decodedToken.uid }
                    });
                }
                
                if (!user) {
                    console.error('Auto-sync failed:', createError.message);
                    return res.status(401).json({ 
                        success: false, 
                        message: 'Not authorized, user sync failed',
                        detail: createError.message
                    });
                }
            }
        }
        // Self-heal: if Firebase custom claims indicate ADMIN but DB has a lesser role, upgrade
        if (claimsRole === 'ADMIN' && user.role !== 'ADMIN') {
            console.log(`[Auth] Role mismatch for ${user.email}: DB=${user.role}, Claims=${claimsRole}. Upgrading to ADMIN.`);
            user = await prisma.user.update({
                where: { id: user.id },
                data: { role: 'ADMIN' }
            });
        }

        // Attach user to request object
        req.user = user;

        // Also attach the raw firebase token payload if needed
        req.firebaseUser = decodedToken;

        next();
    } catch (error) {
        console.error('Auth protect error details:', {
            message: error.message,
            code: error.code,
            isInitialized,
            hasToken: !!req.headers.authorization
        });
        return res.status(401).json({ success: false, message: 'Not authorized, token failed', detail: error.message });
    }
};

/**
 * Authorize middleware
 * Grants access to specific roles only.
 * Must be used AFTER protect middleware.
 */
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user?.role}' is not authorized to access this route`
            });
        }
        next();
    };
};
