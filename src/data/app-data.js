const AppData = {
    shipping_methods: [
        {
            method: 'standard',
            name: 'Standard',
            description: 'Delivery within 4-6 Business Days - Free ($40 minimum)',
            cost: 1.99
        },
        {
            method: 'express',
            name: 'Express',
            description: 'Delivery within 1-3 Business Days - $5.00',
            cost: 5
        }
    ],
    Users: [],
    Cart: [
        {
            id: 'PRDC1',
            category: 'JavaScript',
            title: 'Cool React Component',
            version: '1.0.2',
            author: 'JustCodez',
            image: 'https://unsplash.it/75/91',
            price: 21.50,
            qty: 1,
            total: 21.50,
            inStock: 4
        },
        {
            id: 'PRDC2',
            category: 'JavaScript',
            title: 'JavaScript Widget',
            version: '2.0.1',
            author: 'JSWidets',
            image: 'https://unsplash.it/72/91',
            price: 24.50,
            qty: 1,
            total: 24.50,
            inStock: 5
        },
        {
            id: 'PRDC3',
            category: 'HTML',
            title: 'HTML Form',
            version: '1.1.2',
            author: 'JustCodez',
            image: 'https://unsplash.it/75/90',
            price: 21.50,
            qty: 1,
            total: 21.50,
            inStock: 4
        },
        {
            id: 'PRDC4',
            category: 'Resources',
            title: 'React Cheatsheet',
            version: '1.0.1',
            author: 'ReactGuys',
            image: 'https://unsplash.it/76/91',
            price: 9.99,
            qty: 3,
            total: 29.97,
            inStock: 10
        }
    ]
};

export default AppData;