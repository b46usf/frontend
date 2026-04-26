export async function authenticate({ role }) {
  return Promise.resolve({ ok: true, role });
}
