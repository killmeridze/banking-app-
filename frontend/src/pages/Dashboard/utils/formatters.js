export const formatCurrency = (value, currency = 'USD') => {
    if (value === undefined || value === null) {
        return '0.00 ' + currency;
    }
    return value.toFixed(2) + ' ' + currency;
};
