// --- BẮT XHR TỰ ĐỘNG GÁN DỮ LIỆU LỚP HỌC PHẦN ---
(function() {
  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function() {
    this.addEventListener('load', function() {
      if (
        this.responseURL.includes('getLopHocPhanChoDangKy') ||
        this.responseURL.includes('getHocPhanHocMoi')
      ) {
        try {
          const res = JSON.parse(this.responseText);
          if (res && Array.isArray(res.body)) {
            window.temp1 = res.body;
            console.log('✅ Đã tự động gán window.temp1 từ XHR!', window.temp1);
          }
        } catch (e) {}
      }
    });
    origOpen.apply(this, arguments);
  };
})();

(() => {
  const override = true;
  const key = "__overrideDangKy";

  // ====== TỰ TÌM MẢNG LỚP HỌC PHẦN TRONG WINDOW =========
  const findClassArray = () => {
    for (const key in window) {
      const val = window[key];
      if (Array.isArray(val) && val.length > 0 && typeof val[0] === "object" && "choDangKy" in val[0]) {
        console.log("🎯 Tự động gán mảng lớp học phần:", key);
        return val;
      }
    }
    console.warn("⚠️ Không tìm thấy mảng lớp học phần!");
    return [];
  };

  // ======= TOAST/THÔNG BÁO =========
  let toastTimeout = null;
  function showToast(msg, type = 'info') {
    let toast = document.getElementById('ut-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'ut-toast';
      toast.style.cssText = `
        position: fixed; left: 50%; bottom: 40px; transform: translateX(-50%);
        background: #222; color: #fff; padding: 12px 24px; border-radius: 8px;
        font-size: 15px; z-index: 10000; box-shadow: 0 2px 10px rgba(0,0,0,0.15);
        opacity: 0.95; transition: opacity 0.3s; pointer-events: none;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.background = type === 'error' ? '#d32f2f' : (type === 'success' ? '#388e3c' : '#222');
    toast.style.opacity = '0.95';
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => { toast.style.opacity = '0'; }, 2000);
  }

  // ======= CORE FUNCTIONS =========
  window.overrideDangKy = (arr) => {
    const overridden = arr.map(l => {
      if (l.choDangKy === false && override) {
        l._originalChoDangKy = false;
        l.choDangKy = true;
        l.overrideNote = "Đã ép mở đăng ký (client)";
      }
      return l;
    });
    localStorage.setItem(key, JSON.stringify(overridden));
    console.log("✅ Đã override và lưu vào localStorage");
    return overridden;
  };

  window.getOverriddenDangKy = () => {
    try {
      const data = JSON.parse(localStorage.getItem(key));
      console.log("📦 Đã load từ localStorage:", data);
      return data || [];
    } catch (e) {
      return [];
    }
  };

  window.restoreDangKy = () => {
    window.temp1 = getOverriddenDangKy();
    console.log("✅ Đã khôi phục temp1 từ localStorage");
  };

  window.autoClickDangKy = () => {
    document.querySelectorAll("button").forEach(btn => {
      if (btn.innerText.includes("Đăng ký") && !btn.disabled) {
        btn.click();
      }
    });
    console.log("🖱️ Đã tự động click nút đăng ký");
  };

  // ======= UI =========
  const panel = document.createElement("div");
  panel.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: white;
    border: 2px solid #007bff;
    border-radius: 10px;
    padding: 15px;
    z-index: 9999;
    font-family: sans-serif;
    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    min-width: 220px;
  `;
  panel.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;font-weight:bold; color:#007bff; margin-bottom:8px;">
      <span>📘 Công cụ hỗ trợ UT</span>
      <button id="ut-minimize-btn" style="background:none;border:none;font-size:18px;cursor:pointer;color:#007bff;line-height:1;">_</button>
    </div>
    <div id="ut-panel-content">
      <button id="btn-override" style="margin:5px 0; width:100%;">🚀 Ép mở đăng ký</button>
      <button id="btn-restore" style="margin:5px 0; width:100%;">📦 Khôi phục dữ liệu</button>
      <button id="btn-autoclick" style="margin:5px 0; width:100%;">🛑 Click tất cả 'Đăng ký'</button>
      <button id="btn-unlock" style="margin:5px 0; width:100%; background:#28a745; color:white;">🔓 Bỏ khóa nút Đăng ký</button>
      <button id="btn-scan-lich" style="margin:5px 0; width:100%; background:#007bff; color:white;">📅 Quét lịch tất cả lớp</button>
      <div id="ut-status" style="font-size:13px; color:#555; margin-top:8px; min-height:18px;"></div>
      <div id="ut-lich-table" style="margin-top:10px; max-height:300px; overflow:auto;"></div>
    </div>
  `;
  document.body.appendChild(panel);

  const statusDiv = document.getElementById('ut-status');
  const lichDiv = document.getElementById('ut-lich-table');
  function setStatus(msg, type = 'info') {
    statusDiv.textContent = msg;
    statusDiv.style.color = type === 'error' ? '#d32f2f' : (type === 'success' ? '#388e3c' : '#555');
  }

  // ======= BIND BUTTONS =========
  const btnOverride = document.getElementById("btn-override");
  const btnRestore = document.getElementById("btn-restore");
  const btnAutoClick = document.getElementById("btn-autoclick");
  const btnUnlock = document.getElementById("btn-unlock");
  const btnScanLich = document.getElementById("btn-scan-lich");

  // Nút thu nhỏ/hiện panel
  const minimizeBtn = document.getElementById('ut-minimize-btn');
  const panelContent = document.getElementById('ut-panel-content');
  let minimized = false;
  minimizeBtn.onclick = () => {
    minimized = !minimized;
    if (minimized) {
      panelContent.style.display = 'none';
      minimizeBtn.textContent = '◻';
      panel.style.minWidth = '40px';
      panel.style.padding = '8px 10px';
    } else {
      panelContent.style.display = '';
      minimizeBtn.textContent = '_';
      panel.style.minWidth = '220px';
      panel.style.padding = '15px';
    }
  };

  btnOverride.onclick = () => {
    const arr = findClassArray();
    if (!arr || arr.length === 0) {
      showToast("⚠️ Không tìm thấy dữ liệu lớp học phần!", 'error');
      setStatus("Không tìm thấy dữ liệu lớp học phần!", 'error');
    } else {
      window.temp1 = overrideDangKy(arr);
      showToast("✅ Đã ép mở đăng ký!", 'success');
      setStatus("Đã ép mở đăng ký.", 'success');
      btnOverride.disabled = true;
      setTimeout(() => { btnOverride.disabled = false; }, 1200);
    }
  };

  btnRestore.onclick = () => {
    restoreDangKy();
    showToast("📦 Đã khôi phục temp1.", 'success');
    setStatus("Đã khôi phục dữ liệu.", 'success');
    btnRestore.disabled = true;
    setTimeout(() => { btnRestore.disabled = false; }, 1200);
  };

  btnAutoClick.onclick = () => {
    autoClickDangKy();
    showToast("🖱️ Đã tự động click tất cả nút Đăng ký", 'success');
    setStatus("Đã tự động click tất cả nút Đăng ký.", 'success');
    btnAutoClick.disabled = true;
    setTimeout(() => { btnAutoClick.disabled = false; }, 1200);
  };

  btnUnlock.onclick = () => {
    let count = 0;
    document.querySelectorAll('button').forEach(btn => {
      if (btn.innerText.includes('Đăng ký') && btn.disabled) {
        btn.disabled = false;
        btn.classList.remove('disabled');
        btn.style.opacity = 1;
        count++;
      }
    });
    if (count > 0) {
      showToast(`🔓 Đã mở khóa ${count} nút Đăng ký!`, 'success');
      setStatus(`Đã mở khóa ${count} nút Đăng ký.`, 'success');
    } else {
      showToast('Không có nút Đăng ký nào bị khóa!', 'info');
      setStatus('Không có nút Đăng ký nào bị khóa!', 'info');
    }
    btnUnlock.disabled = true;
    setTimeout(() => { btnUnlock.disabled = false; }, 1200);
  };

  btnScanLich.onclick = async () => {
    lichDiv.innerHTML = '';
    const arr = findClassArray();
    if (!arr || arr.length === 0) {
      showToast("⚠️ Không tìm thấy dữ liệu lớp học phần!", 'error');
      setStatus("Không tìm thấy dữ liệu lớp học phần!", 'error');
      return;
    }
    showToast('⏳ Đang quét lịch các lớp...', 'info');
    setStatus('Đang quét lịch các lớp...');
    const token = localStorage.getItem("account");
    let results = [];
    for (let i = 0; i < arr.length; i++) {
      const lop = arr[i];
      try {
        const res = await fetch(`https://portal.ut.edu.vn/api/v1/dkhpdk/getLopHocPhanDetail?idLopHocPhan=${lop.id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "accept": "application/json, text/plain, */*"
          }
        });
        const data = await res.json();
        if (data.body && Array.isArray(data.body) && data.body.length > 0) {
          results.push({
            tenMonHoc: lop.tenMonHoc,
            maLopHocPhan: lop.maLopHocPhan,
            lich: data.body
          });
        }
      } catch (e) {}
    }
    if (results.length === 0) {
      lichDiv.innerHTML = '<div style="color:#d32f2f;">Không lấy được lịch học lớp nào!</div>';
      setStatus('Không lấy được lịch học lớp nào!', 'error');
      showToast('❌ Không lấy được lịch học lớp nào!', 'error');
      return;
    }
    // Render bảng lịch học
    let html = `<table border="1" style="border-collapse:collapse;width:100%;font-size:13px;">
      <tr style="background:#e3f0ff;font-weight:bold;">
        <td>Tên môn học</td><td>Mã lớp</td><td>Thứ</td><td>Tiết</td><td>Phòng</td><td>Dãy nhà</td><td>Thời gian</td>
      </tr>`;
    results.forEach(lop => {
      lop.lich.forEach(lich => {
        html += `<tr><td>${lop.tenMonHoc}</td><td>${lop.maLopHocPhan}</td><td>${lich.thu||''}</td><td>${lich.tiet||''}</td><td>${lich.phong||''}</td><td>${lich.dayNha||''}</td><td>${lich.thoiGian||''}</td></tr>`;
      });
    });
    html += '</table>';
    lichDiv.innerHTML = html;
    setStatus(`Đã quét xong ${results.length} lớp!`, 'success');
    showToast(`✅ Đã quét xong ${results.length} lớp!`, 'success');
  };

  setStatus("Sẵn sàng.");
  console.log("🧠 Đã tạo UI và tự động tìm mảng lớp.");
})(); 