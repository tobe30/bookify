import { axiosInstance } from "./axios"

export const getAuthuser = async () => {
    try {
        const res = await axiosInstance.get("/auth/me");
        return res.data.user
    } catch {
        return null
    }
}

export const signup = async (registerData) => {
    const response = await axiosInstance.post("/auth/register", registerData);
    return response.data;
};


export const login = async (loginData)=> {
    const response = await axiosInstance.post("/auth/login", loginData);
    return response.data;
};

//logout
export const logout = async ()=> {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
};

export const addBook = async ({ bookData, image }) => {
    const formData = new FormData();

    formData.append("bookData", JSON.stringify(bookData));
    formData.append("image", image);

    const response = await axiosInstance.post("/books", formData);
    return response.data;
};

export const getAdminBooks = async () => {
    const response = await axiosInstance.get("/books/admin/all");
    return response.data.books;
};

export const updateBook = async ({ bookId, bookData, image }) => {
    const formData = new FormData();

    formData.append("bookData", JSON.stringify(bookData));

    if (image) {
        formData.append("image", image);
    }

    const response = await axiosInstance.put(`/books/${bookId}`, formData);
    return response.data;
};

export const deleteBook = async (bookId) => {
    const response = await axiosInstance.delete(`/books/${bookId}`);
    return response.data;
};

export const getAdminUsers = async () => {
    const response = await axiosInstance.get("/users/admin/all");
    return response.data.users;
};

export const getBooks = async () => {
    const response = await axiosInstance.get("/books");

    return response.data.books.map((book) => ({
        ...book,
        id: book._id,
    }));
};

export const getBookById = async (bookId) => {
  const response = await axiosInstance.get(`/books/${bookId}`);
  const book = response.data.book;

  return {
    ...book,
    id: book.id ?? book._id,
  };
};

export const getUserOrders = async () => {
  const response = await axiosInstance.get('/orders/my-orders');
  return response.data.orders.map((order) => ({
    ...order,
    id: order._id,
    customer: order.deliveryInfo,
    items: order.orderItems.map((item) => ({
      book: {
        ...item.bookId,
        id: item.bookId._id || item.bookId.id,
      },
      quantity: item.quantity,
    })),
  }));
};

export const getAdminOrders = async () => {
  const response = await axiosInstance.get('/orders/admin/all');
  return response.data.orders.map((order) => ({
    ...order,
    id: order._id,
    customer: order.deliveryInfo,
    items: order.orderItems.map((item) => ({
      book: {
        ...item.bookId,
        id: item.bookId._id || item.bookId.id,
      },
      quantity: item.quantity,
    })),
  }));
};

export const updateOrderStatus = async ({ orderId, status }) => {
  const response = await axiosInstance.patch(`/orders/${orderId}/status`, { status });
  return response.data.order;
};

export const createOrder = async (orderData) => {
  const response = await axiosInstance.post('/orders', orderData);
  return response.data;
};

export const initializePaystack = async (orderData) => {
  const response = await axiosInstance.post('/payments/initialize', orderData);
  return response.data;
};

export const verifyPayment = async (reference) => {
  const response = await axiosInstance.get(`/payments/verify?reference=${encodeURIComponent(reference)}`);
  return response.data;
};
