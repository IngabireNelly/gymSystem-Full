import { MobileNetwork, Plan } from "../types/gym";

export const plans: Plan[] = [
{ type: "Monthly", price: 19, months: 1, period: "/mo", billing: "Billed monthly" },
{ type: "Quarterly", price: 49, months: 3, period: "/3mo", billing: "Billed every 3 months" },
{ type: "Annual", price: 180, months: 12, period: "/yr", billing: "Billed yearly" }];


export const mobileNetworks: MobileNetwork[] = ["MTN MoMo", "Airtel Money"];