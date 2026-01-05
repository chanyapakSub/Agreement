
export interface ContractRole {
    label: string;
    enLabel?: string; // For things that might need English e.g. "Lessor"
}

export interface ContractTypeDefinition {
    id: string;
    label: string;
    shortLabel: string;
    keywords: string[]; // For basic inclusion
    excludeKeywords?: string[]; // For exclusion
    roles: {
        lessor: ContractRole;
        lessee: ContractRole;
    };
    isReceipt?: boolean;
}

export const CONTRACT_TYPES: Record<string, ContractTypeDefinition> = {
    LEASE: {
        id: 'LEASE',
        label: 'สัญญาเช่า (Lease Agreement)',
        shortLabel: 'เช่า',
        keywords: ['เช่า', 'Lease'],
        excludeKeywords: ['Receipt', 'ซื้อ', 'Buy', 'ใบรับเงิน', 'นายหน้า', 'Agency', 'Broker', 'จอง', 'Reservation', 'Booking', 'แต่งตั้ง'],
        roles: {
            lessor: { label: 'ผู้ให้เช่า', enLabel: 'Lessor' },
            lessee: { label: 'ผู้เช่า', enLabel: 'Lessee' }
        }
    },
    BUY: {
        id: 'BUY',
        label: 'สัญญาจะซื้อจะขาย (Buy/Sell Agreement)',
        shortLabel: 'ซื้อขาย',
        keywords: ['ซื้อ', 'Buy'],
        roles: {
            lessor: { label: 'ผู้จะขาย', enLabel: 'Seller' },
            lessee: { label: 'ผู้จะซื้อ', enLabel: 'Buyer' }
        }
    },
    RECEIPT: {
        id: 'RECEIPT',
        label: 'ใบเสร็จรับเงิน (Receipt)',
        shortLabel: 'ใบเสร็จ',
        keywords: ['Receipt', 'ใบรับเงิน'],
        roles: {
            lessor: { label: 'ผู้รับเงิน', enLabel: 'Collector' },
            lessee: { label: 'ผู้จ่ายเงิน', enLabel: 'Payer' }
        },
        isReceipt: true
    },
    AGENCY: {
        id: 'AGENCY',
        label: 'สัญญาแต่งตั้งนายหน้า (Broker Appointment Agreement)',
        shortLabel: 'นายหน้า',
        keywords: ['นายหน้า', 'Agency', 'Broker', 'แต่งตั้ง'],
        excludeKeywords: [],
        roles: {
            lessor: { label: 'เจ้าของทรัพย์', enLabel: 'Owner' },
            lessee: { label: 'นายหน้า', enLabel: 'Agent' }
        }
    },
    RESERVATION: {
        id: 'RESERVATION',
        label: 'รายละเอียดการจองห้องเช่า (Rental Reservation)',
        shortLabel: 'ใบจอง',
        keywords: ['จอง', 'Reservation', 'Booking'],
        excludeKeywords: ['Agreement', 'สัญญา'],
        roles: {
            lessor: { label: 'ผู้ให้เช่า', enLabel: 'Lessor' },
            lessee: { label: 'ผู้จอง', enLabel: 'Tenant' }
        }
    },
    RESERVATION_AGREEMENT: {
        id: 'RESERVATION_AGREEMENT',
        label: 'สัญญาจองคอนโดสำหรับเช่า (Rental Reservation Agreement)',
        shortLabel: 'สัญญาจอง',
        keywords: ['สัญญาจอง', 'Reservation Agreement'],
        excludeKeywords: [],
        roles: {
            lessor: { label: 'ผู้ให้เช่า', enLabel: 'Lessor' },
            lessee: { label: 'ผู้เช่า', enLabel: 'Lessee' }
        }
    },
    OPEN_AGENCY: {
        id: 'OPEN_AGENCY',
        label: 'สัญญาแต่งตั้งนายหน้าแบบเปิด (Open Agency Agreement)',
        shortLabel: 'นายหน้า(เปิด)',
        keywords: ['นายหน้าแบบเปิด', 'Open Agency'],
        excludeKeywords: [],
        roles: {
            lessor: { label: 'เจ้าของทรัพย์', enLabel: 'Owner' },
            lessee: { label: 'นายหน้า', enLabel: 'Agent' }
        }
    },
    CO_BROKER: {
        id: 'CO_BROKER',
        label: 'หนังสือสัญญาระหว่างนายหน้า (Co-Broker Agreement)',
        shortLabel: 'Co-Broker',
        keywords: ['ระหว่างนายหน้า', 'Co-Broker'],
        excludeKeywords: [],
        roles: {
            lessor: { label: 'นายหน้าฝ่ายผู้ขาย', enLabel: 'Seller Agent' },
            lessee: { label: 'นายหน้าฝ่ายผู้ซื้อ', enLabel: 'Buyer Agent' }
        }
    }
};

export const CONTRACT_TYPE_OPTIONS = Object.values(CONTRACT_TYPES);

export function getContractType(id: string) {
    return CONTRACT_TYPES[id] || CONTRACT_TYPES.LEASE;
}
