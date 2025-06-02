import {
	VNPay,
	HashAlgorithm,
	VnpCurrCode,
	VnpLocale,
	ProductCode,
	ignoreLogger,
} from 'vnpay';

export const vnpay = new VNPay({
	tmnCode: String(process.env.VNP_TMNCODE),
	secureSecret: String(process.env.VNP_HASHSECRET),
	vnpayHost: String(process.env.VNPAYHOST),
	testMode: true,
	hashAlgorithm: HashAlgorithm.SHA512,
	vnp_Version: '2.1.0',
	vnp_CurrCode: VnpCurrCode.VND,
	vnp_Locale: VnpLocale.VN,
	vnp_OrderType: ProductCode.Pay,
	enableLog: true,
	loggerFn: ignoreLogger,

	endpoints: {
		paymentEndpoint: 'paymentv2/vpcpay.html',
		queryDrRefundEndpoint: 'merchant_webapi/api/transaction',
		getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list',
	},
});

export const vnpayConfig = {
	vnp_IpAddr: String(process.env.VNPAY_IP_ADDRESS_BACK_END_RETUR) || '',
	vnp_ReturnUrl: String(process.env.VNPAY_RETURN_URL_FRONT_END) || '',
};
