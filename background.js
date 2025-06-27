async function getCurrentIdDot() {
  // Gọi API lấy danh sách đợt đăng ký
  const res = await fetch('https://portal.ut.edu.vn/api/v1/dkhpdk/getDotDangKy', {
    credentials: 'include'
  });
  const data = await res.json();
  if (!data.body || !Array.isArray(data.body)) return null;
  // Tìm đợt đang mở (tùy vào trường trạng thái, có thể là 'trangThai' hoặc 'isActive')
  const current = data.body.find(dot =>
    (dot.trangThai && dot.trangThai.toLowerCase().includes('diễn ra')) ||
    dot.isActive === true
  );
  return current ? current.idDot : null;
}

chrome.alarms.create('checkRegistration', { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'checkRegistration') {
    try {
      // 1. Lấy idDot tự động
      const idDot = await getCurrentIdDot();
      if (!idDot) return;

      // 2. Lấy danh sách mã học phần
      const resMon = await fetch(`https://portal.ut.edu.vn/api/v1/dkhpdk/getHocPhanHocMoi?idDot=${idDot}`, {
        credentials: 'include'
      });
      const dataMon = await resMon.json();
      if (!dataMon.body || !Array.isArray(dataMon.body)) return;

      // 3. Lặp qua từng mã học phần, kiểm tra lớp mở đăng ký
      let found = false;
      for (const mon of dataMon.body) {
        const maHocPhan = mon.maHocPhan;
        const resLop = await fetch(`https://portal.ut.edu.vn/api/v1/dkhpdk/getLopHocPhanChoDangKy?idDot=${idDot}&maHocPhan=${maHocPhan}&isLocTrung=false&isLocTQ=false`, {
          credentials: 'include'
        });
        const dataLop = await resLop.json();
        if (dataLop.body && dataLop.body.some(lop => lop.choDangKy === true)) {
          found = true;
          break;
        }
      }

      // 4. Nếu có lớp mở đăng ký, gửi thông báo
      if (found) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icon.png',
          title: 'Có lớp mở đăng ký!',
          message: 'Nhanh tay vào đăng ký ngay!'
        });
        chrome.tabs.query({url: "*://portal.ut.edu.vn/*"}, (tabs) => {
          if (tabs.length > 0) {
            chrome.scripting.executeScript({
              target: {tabId: tabs[0].id},
              func: () => {
                const audio = new Audio('https://notificationsounds.com/storage/sounds/file-sounds-1152-pristine.mp3');
                audio.play();
              }
            });
          }
        });
      }
    } catch (e) {
      // Xử lý lỗi nếu cần
    }
  }
}); 