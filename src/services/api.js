export const api = {
  async getDashboard(role) {
    return Promise.resolve({ role, generatedAt: new Date().toISOString() });
  },
};
