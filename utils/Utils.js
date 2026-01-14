const formatCurrency = (value) => {
    if (!value && value !== 0) return '';
    const number = typeof value === 'number' ? value : Number(value);
    if (isNaN(number)) return value;
    return number.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};
export { formatCurrency };