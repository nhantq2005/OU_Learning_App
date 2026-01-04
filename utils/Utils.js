const formatCurrency = (value) => {
    if (!value && value !== 0) return '';
    // Nếu là số, định dạng luôn, nếu là chuỗi thì chuyển sang số
    const number = typeof value === 'number' ? value : Number(value);
    if (isNaN(number)) return value;
    return number.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};
export { formatCurrency };