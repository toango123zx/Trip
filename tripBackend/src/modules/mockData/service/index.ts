import { PrismaClient } from '@prisma/client';

import { mockSuppliersDataService } from './supplier.service';

const primaSerivce = new PrismaClient();

const mockDataSevice = async (): Promise<void> => {
    // await mockTouristsDataService();
    await mockSuppliersDataService();
    console.log('Mock data service started...');
};

mockDataSevice()
    .then(() => {
        primaSerivce.$disconnect();
        console.log('Mock data service executed successfully.');
    })
    .catch((error) => {
        console.error('Error executing mock data service:', error);
        primaSerivce.$disconnect();
    });
