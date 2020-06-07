export const loggedIn = () => {
    const token = localStorage.getItem('auth');
    return token;
};

export const adminLoggedIn = () => {
    const admin = localStorage.getItem('admin');
    return admin;
};

export const logout = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('admin');
    localStorage.removeItem('user');
    window.location.reload(false);
};

export const setToken = (token) => {
    localStorage.setItem('auth', token);
};

export const setAdmin = (admin) => {
    localStorage.setItem('admin', admin);
};

export const setUser = (user) => {
    localStorage.setItem('user', user);
};