/**
 * Seed Restaurants & Menu Items
 * Populates the database with realistic Pakistani restaurant data for RAG testing.
 *
 * Usage: node rag/scripts/seedData.js
 */

const prisma = require('../../config/db');

const SEED_RESTAURANTS = [
  {
    name: 'Burger Lab',
    businessType: 'Fast Food',
    cuisineTypes: ['Fast Food', 'Burgers', 'American'],
    description: 'Premium gourmet burgers with a unique twist. Known for creative burger recipes and fresh ingredients.',
    address: '123 Main Boulevard, Gulberg',
    city: 'Lahore',
    area: 'Gulberg',
    openingTime: '12:00',
    closingTime: '02:00',
    status: 'OPEN',
    deliveryFee: 100,
    priceRange: '$$',
    dineIn: true,
    takeaway: true,
    delivery: true,
    rating: 4.5,
    reviewCount: 320,
    categories: [
      {
        name: 'Signature Burgers',
        items: [
          { name: 'The OG Burger', description: 'Classic beef patty with special sauce, lettuce, and cheese', price: 650 },
          { name: 'Smoky BBQ Burger', description: 'Smoked beef patty with BBQ sauce, caramelized onions, and jalapenos', price: 750 },
          { name: 'Mushroom Swiss Burger', description: 'Beef patty with sauteed mushrooms and Swiss cheese', price: 800 },
        ],
      },
      {
        name: 'Sides',
        items: [
          { name: 'Loaded Fries', description: 'Crispy fries topped with cheese sauce and jalapenos', price: 350 },
          { name: 'Onion Rings', description: 'Golden crispy onion rings with dipping sauce', price: 300 },
        ],
      },
    ],
  },
  {
    name: 'Kaybees Restaurant',
    businessType: 'Restaurant',
    cuisineTypes: ['Pakistani', 'Desi', 'BBQ'],
    description: 'Authentic Pakistani cuisine with a focus on BBQ and traditional dishes. Family-friendly environment.',
    address: '45 Jail Road',
    city: 'Lahore',
    area: 'Jail Road',
    openingTime: '11:00',
    closingTime: '23:30',
    status: 'OPEN',
    deliveryFee: 150,
    priceRange: '$$$',
    dineIn: true,
    takeaway: true,
    delivery: true,
    rating: 4.2,
    reviewCount: 540,
    categories: [
      {
        name: 'BBQ',
        items: [
          { name: 'Chicken Tikka', description: 'Marinated chicken tikka pieces grilled to perfection', price: 450 },
          { name: 'Seekh Kabab', description: 'Spiced minced meat kababs grilled on skewers', price: 400 },
          { name: 'Malai Boti', description: 'Creamy marinated chicken boti with mild spices', price: 500 },
        ],
      },
      {
        name: 'Karahi',
        items: [
          { name: 'Chicken Karahi', description: 'Traditional chicken karahi with tomatoes and green chilies', price: 1200 },
          { name: 'Mutton Karahi', description: 'Tender mutton cooked in rich karahi masala', price: 1800 },
        ],
      },
    ],
  },
  {
    name: 'Pizza Point',
    businessType: 'Fast Food',
    cuisineTypes: ['Italian', 'Fast Food', 'Pizza'],
    description: 'Affordable and delicious pizzas with a wide variety of toppings. Quick delivery guaranteed.',
    address: '78 University Road',
    city: 'Faisalabad',
    area: 'University Road',
    openingTime: '11:00',
    closingTime: '01:00',
    status: 'OPEN',
    deliveryFee: 50,
    priceRange: '$',
    dineIn: true,
    takeaway: true,
    delivery: true,
    rating: 3.8,
    reviewCount: 180,
    categories: [
      {
        name: 'Pizzas',
        items: [
          { name: 'Chicken Fajita Pizza', description: 'Loaded with chicken fajita, capsicum, onions and mozzarella', price: 800 },
          { name: 'Pepperoni Pizza', description: 'Classic pepperoni with extra cheese and tomato sauce', price: 750 },
          { name: 'BBQ Chicken Pizza', description: 'BBQ chicken, mushrooms, and olives on a thin crust', price: 850 },
        ],
      },
      {
        name: 'Pastas',
        items: [
          { name: 'Chicken Alfredo Pasta', description: 'Creamy alfredo sauce with grilled chicken and penne', price: 550 },
          { name: 'Arrabiata Pasta', description: 'Spicy tomato-based pasta with garlic and herbs', price: 450 },
        ],
      },
    ],
  },
  {
    name: 'Howdy',
    businessType: 'Fast Food',
    cuisineTypes: ['Burgers', 'Fast Food', 'Wraps'],
    description: 'Trendy fast food spot known for loaded burgers, wraps, and shakes. Popular among students.',
    address: '21 Kohinoor Plaza, Satyana Road',
    city: 'Faisalabad',
    area: 'Satyana Road',
    openingTime: '13:00',
    closingTime: '01:00',
    status: 'OPEN',
    deliveryFee: 80,
    priceRange: '$$',
    dineIn: true,
    takeaway: true,
    delivery: true,
    rating: 4.0,
    reviewCount: 210,
    categories: [
      {
        name: 'Burgers',
        items: [
          { name: 'Howdy Special Burger', description: 'Double patty with special howdy sauce and crispy bacon', price: 550 },
          { name: 'Zinger Burger', description: 'Crispy fried chicken fillet with mayo and lettuce', price: 450 },
        ],
      },
      {
        name: 'Wraps',
        items: [
          { name: 'Chicken Wrap', description: 'Grilled chicken wrap with ranch sauce and veggies', price: 400 },
          { name: 'Falafel Wrap', description: 'Crispy falafel with hummus, pickles and tahini', price: 350 },
        ],
      },
      {
        name: 'Shakes',
        items: [
          { name: 'Oreo Shake', description: 'Thick and creamy Oreo milkshake', price: 350 },
          { name: 'Nutella Shake', description: 'Rich Nutella shake with whipped cream', price: 400 },
        ],
      },
    ],
  },
  {
    name: 'Cafe Aylanto',
    businessType: 'Fine Dining',
    cuisineTypes: ['Continental', 'Italian', 'French'],
    description: 'Upscale fine dining restaurant serving continental cuisine in an elegant setting. Perfect for special occasions.',
    address: 'MM Alam Road',
    city: 'Lahore',
    area: 'Gulberg',
    openingTime: '12:00',
    closingTime: '00:00',
    status: 'OPEN',
    deliveryFee: 250,
    priceRange: '$$$',
    dineIn: true,
    takeaway: false,
    delivery: true,
    rating: 4.6,
    reviewCount: 420,
    categories: [
      {
        name: 'Starters',
        items: [
          { name: 'Bruschetta', description: 'Toasted bread with fresh tomatoes, basil, and olive oil', price: 650 },
          { name: 'Soup of the Day', description: 'Freshly prepared seasonal soup served with garlic bread', price: 500 },
        ],
      },
      {
        name: 'Mains',
        items: [
          { name: 'Grilled Salmon', description: 'Atlantic salmon with lemon butter sauce and asparagus', price: 2200 },
          { name: 'Chicken Cordon Bleu', description: 'Stuffed chicken breast with ham and cheese, pan-fried golden', price: 1800 },
          { name: 'Beef Tenderloin', description: 'Premium beef tenderloin with mushroom sauce and mashed potatoes', price: 2800 },
        ],
      },
    ],
  },
  {
    name: 'Chaaye Khana',
    businessType: 'Cafe',
    cuisineTypes: ['Cafe', 'Pakistani', 'Tea'],
    description: 'Cozy traditional tea house with a modern twist. Serves a variety of teas, desi breakfast, and snacks.',
    address: 'Lakshmi Chowk',
    city: 'Lahore',
    area: 'Old Lahore',
    openingTime: '08:00',
    closingTime: '23:00',
    status: 'OPEN',
    deliveryFee: 80,
    priceRange: '$',
    dineIn: true,
    takeaway: true,
    delivery: false,
    rating: 4.3,
    reviewCount: 290,
    categories: [
      {
        name: 'Chai & Beverages',
        items: [
          { name: 'Doodh Patti', description: 'Traditional Pakistani milk tea brewed to perfection', price: 100 },
          { name: 'Kashmiri Chai', description: 'Pink tea with cardamom, almonds, and pistachios', price: 200 },
          { name: 'Iced Coffee', description: 'Cold brewed coffee with milk and ice', price: 250 },
        ],
      },
      {
        name: 'Desi Breakfast',
        items: [
          { name: 'Halwa Puri', description: 'Traditional halwa puri with channay and achar', price: 350 },
          { name: 'Paratha Roll', description: 'Egg paratha roll with chutney and salad', price: 200 },
        ],
      },
    ],
  },
  {
    name: 'Student Biryani',
    businessType: 'Restaurant',
    cuisineTypes: ['Pakistani', 'Biryani', 'Desi'],
    description: 'Famous for its flavorful biryani at student-friendly prices. Quick service and generous portions.',
    address: 'D Ground',
    city: 'Faisalabad',
    area: 'D Ground',
    openingTime: '11:00',
    closingTime: '23:00',
    status: 'OPEN',
    deliveryFee: 50,
    priceRange: '$',
    dineIn: true,
    takeaway: true,
    delivery: true,
    rating: 3.9,
    reviewCount: 650,
    categories: [
      {
        name: 'Biryani',
        items: [
          { name: 'Student Special Biryani', description: 'Signature spicy chicken biryani with raita', price: 250 },
          { name: 'Mutton Biryani', description: 'Aromatic mutton biryani cooked in traditional spices', price: 400 },
          { name: 'Zinger Biryani', description: 'Crispy zinger topped on spiced biryani rice', price: 350 },
        ],
      },
      {
        name: 'Rolls & Extras',
        items: [
          { name: 'Chicken Roll', description: 'Spiced chicken wrapped in paratha with chutney', price: 180 },
          { name: 'Raita', description: 'Cool yogurt with spices, perfect with biryani', price: 50 },
        ],
      },
    ],
  },
  {
    name: 'Monal Restaurant',
    businessType: 'Fine Dining',
    cuisineTypes: ['Pakistani', 'Continental', 'BBQ'],
    description: 'Premium dining with stunning views. Serves a mix of Pakistani and continental cuisine. Ideal for family gatherings.',
    address: 'Pir Sohawa Road, Margalla Hills',
    city: 'Islamabad',
    area: 'Margalla Hills',
    openingTime: '11:00',
    closingTime: '23:00',
    status: 'OPEN',
    deliveryFee: 300,
    priceRange: '$$$',
    dineIn: true,
    takeaway: false,
    delivery: false,
    rating: 4.4,
    reviewCount: 1200,
    categories: [
      {
        name: 'BBQ Platter',
        items: [
          { name: 'Monal BBQ Platter', description: 'Assorted BBQ items including tikka, seekh kabab, and malai boti for 2', price: 2500 },
          { name: 'Lamb Chops', description: 'Tender marinated lamb chops grilled to perfection', price: 1800 },
        ],
      },
      {
        name: 'Continental',
        items: [
          { name: 'Chicken Steak', description: 'Grilled chicken steak with pepper sauce and vegetables', price: 1200 },
          { name: 'Fish & Chips', description: 'Crispy battered fish with fries and tartar sauce', price: 1000 },
        ],
      },
    ],
  },
  {
    name: 'Savour Foods',
    businessType: 'Restaurant',
    cuisineTypes: ['Pakistani', 'Pulao', 'Desi'],
    description: 'Iconic Islamabad restaurant famous for its chicken pulao. A must-visit for anyone in the capital.',
    address: 'F-7 Markaz',
    city: 'Islamabad',
    area: 'F-7',
    openingTime: '07:00',
    closingTime: '22:00',
    status: 'OPEN',
    deliveryFee: 100,
    priceRange: '$',
    dineIn: true,
    takeaway: true,
    delivery: true,
    rating: 4.7,
    reviewCount: 2100,
    categories: [
      {
        name: 'Pulao',
        items: [
          { name: 'Chicken Pulao', description: 'Famous Savour chicken pulao with tender chicken pieces', price: 300 },
          { name: 'Beef Pulao', description: 'Rich beef pulao cooked in traditional spices', price: 350 },
        ],
      },
      {
        name: 'Extras',
        items: [
          { name: 'Seekh Kabab (2 pcs)', description: 'Juicy seekh kababs, perfect with pulao', price: 200 },
          { name: 'Raita', description: 'Fresh yogurt raita with cucumber and mint', price: 50 },
        ],
      },
    ],
  },
  {
    name: 'Kababjees',
    businessType: 'Restaurant',
    cuisineTypes: ['Pakistani', 'BBQ', 'Karahi'],
    description: 'Popular for its BBQ and karahi dishes. Known for generous portions and authentic taste.',
    address: 'Clifton Block 5',
    city: 'Karachi',
    area: 'Clifton',
    openingTime: '12:00',
    closingTime: '00:00',
    status: 'OPEN',
    deliveryFee: 120,
    priceRange: '$$',
    dineIn: true,
    takeaway: true,
    delivery: true,
    rating: 4.1,
    reviewCount: 890,
    categories: [
      {
        name: 'BBQ',
        items: [
          { name: 'Chicken Tikka (Full)', description: 'Full plate of marinated chicken tikka', price: 800 },
          { name: 'Mutton Seekh Kabab', description: 'Spiced mutton seekh kababs with mint chutney', price: 600 },
        ],
      },
      {
        name: 'Karahi',
        items: [
          { name: 'Chicken White Karahi', description: 'Creamy white karahi with mild spices and cream', price: 1500 },
          { name: 'Beef Karahi', description: 'Spicy beef karahi with fresh tomatoes and ginger', price: 2000 },
        ],
      },
      {
        name: 'Rice',
        items: [
          { name: 'Chicken Biryani', description: 'Authentic Karachi-style chicken biryani', price: 400 },
        ],
      },
    ],
  },
];

async function seed() {
  // Get the first user with RESTAURANT_OWNER role, or any user as fallback
  let owner = await prisma.user.findFirst({ where: { role: 'RESTAURANT_OWNER' } });
  if (!owner) {
    owner = await prisma.user.findFirst();
  }
  if (!owner) {
    console.error('No users found in DB. Please create a user first.');
    process.exit(1);
  }

  console.log(`Using owner: ${owner.fullName} (${owner.id})`);

  let restaurantCount = 0;
  let itemCount = 0;

  for (const data of SEED_RESTAURANTS) {
    // Skip if restaurant already exists by name + city
    const existing = await prisma.restaurant.findFirst({
      where: { name: data.name, city: data.city },
    });
    if (existing) {
      console.log(`  Skipping "${data.name}" (already exists)`);
      continue;
    }

    const { categories, ...restaurantData } = data;

    const restaurant = await prisma.restaurant.create({
      data: {
        ...restaurantData,
        ownerId: owner.id,
      },
    });
    restaurantCount++;
    console.log(`  Created restaurant: ${restaurant.name}`);

    for (const cat of categories) {
      const category = await prisma.category.create({
        data: {
          restaurantId: restaurant.id,
          name: cat.name,
        },
      });

      for (const item of cat.items) {
        await prisma.menuItem.create({
          data: {
            restaurantId: restaurant.id,
            categoryId: category.id,
            name: item.name,
            description: item.description,
            price: item.price,
          },
        });
        itemCount++;
      }
    }
  }

  console.log(`\nSeeded ${restaurantCount} restaurants and ${itemCount} menu items.`);
}

seed()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
