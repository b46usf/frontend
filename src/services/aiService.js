export async function getAIInsight(role = 'student') {
  const messages = {
    student: 'AI menyarankan latihan gradien 10 menit sebelum lanjut ke fungsi kuadrat.',
    teacher: 'Tiga siswa menunjukkan gap pada konsep pecahan dan perlu intervensi minggu ini.',
    admin: 'Rasio akun aktif meningkat, namun kelas X perlu onboarding ulang untuk aplikasi.',
  };

  return Promise.resolve(messages[role]);
}
