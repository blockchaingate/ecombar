export interface App {
    _id?: string;
    name?: string;
    fullName?: string;
    domain?: string;

    merchantId?: string;
    memberId?: string;

    desc?: string;

    active?: boolean;
    lastUpdated?: Date;
    dateCreated?: Date;
}