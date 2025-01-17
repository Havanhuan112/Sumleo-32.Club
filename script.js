   //sóksjsnsnsnsnssnns


let selectedBet = ""; // Loại cược đã chọn
let userBalance = 56789; // Số dư mặc định khi đăng nhập
const maxAccounts = 100000000; // Giới hạn số tài khoản tối đa
let accountCount = 0; // Biến theo dõi số tài khoản đã tạo

// Kiểm tra số lượng tài khoản đã đăng ký từ LocalStorage
const accounts = JSON.parse(localStorage.getItem('accounts')) || []; // Lấy danh sách tài khoản đã đăng ký

// Kiểm tra nếu số tài khoản đã đạt giới hạn
accountCount = accounts.length;

// Đăng nhập và phát nhạc khi đăng nhập
document.getElementById('login-btn').addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();

    // Kiểm tra nếu tên người dùng rỗng
    if (username === '') {
        alert('Vui lòng nhập tên của bạn!');
        return;
    }

    // Kiểm tra số lượng tài khoản đã tạo
    if (accountCount >= maxAccounts) {
        alert('Bạn đã tạo quá giới hạn tài khoản. Không thể đăng nhập thêm tài khoản!');
        return;
    }

    // Kiểm tra nếu tài khoản đã tồn tại
    if (accounts.find(account => account.username === username)) {
        alert('Tài khoản này đã tồn tại. Vui lòng chọn tên khác.');
        return;
    }

    // Phát nhạc khi đăng nhập
    const music = document.getElementById('background-music');
    music.play().catch(error => {
        console.error("Lỗi khi phát nhạc:", error);
    });

    // Lưu tài khoản vào Local Storage
    accounts.push({ username: username });
    localStorage.setItem('accounts', JSON.stringify(accounts));
    accountCount++; // Tăng số tài khoản đã tạo

    alert(`Chào mừng, ${username}!`);
    document.getElementById('display-username').textContent = `Người chơi: ${username}`;
    document.getElementById('form-container').classList.add('hidden');
    document.getElementById('game-area').classList.remove('hidden');
});

// Xử lý chọn loại cược
document.getElementById('bet-tai').addEventListener('click', () => handleBetSelection('Tài'));
document.getElementById('bet-xiu').addEventListener('click', () => handleBetSelection('Xỉu'));
document.getElementById('bet-chan').addEventListener('click', () => handleBetSelection('Chẵn'));
document.getElementById('bet-le').addEventListener('click', () => handleBetSelection('Lẻ'));

// Hiển thị form đặt cược
function handleBetSelection(bet) {
    selectedBet = bet;
    document.getElementById('status').textContent = `Bạn đã chọn cược: ${bet}`;
    document.getElementById('bet-form').classList.remove('hidden');
    document.getElementById('error-message').classList.add('hidden'); // Ẩn lỗi nếu có
}

// Xử lý đặt cược
document.getElementById('confirm-bet').addEventListener('click', () => {
    const betAmount = parseInt(document.getElementById('bet-amount').value, 10);

    if (isNaN(betAmount) || betAmount <= 0) {
        alert('Vui lòng nhập số tiền hợp lệ!');
        return;
    }

    if (betAmount > userBalance) {
        document.getElementById('error-message').classList.remove('hidden');
        return;
    }

    // Trừ tiền
    userBalance -= betAmount;
    document.getElementById('display-balance').textContent = `Số dư: ${userBalance.toLocaleString()}₫`;
    document.getElementById('bet-form').classList.add('hidden');
    document.getElementById('loading-message').classList.remove('hidden');

    // Hiển thị thông báo chờ và quay xúc xắc
    setTimeout(() => {
        document.getElementById('loading-message').classList.add('hidden');
        rollDice(betAmount);
    }, 8000);
});

// Quay xúc xắc
function rollDice(betAmount) {
    const diceValue = Math.floor(Math.random() * 6) + 1;
    const diceContainer = document.getElementById('dice-container');
    diceContainer.textContent = "🎲";

    setTimeout(() => {
        diceContainer.textContent = diceValue;
        checkResult(diceValue, betAmount);
    }, 1000);
}

// Kiểm tra kết quả
function checkResult(diceValue, betAmount) {
    let result = diceValue >= 4 ? "Tài" : "Xỉu";
    result += diceValue % 2 === 0 ? " và Chẵn" : " và Lẻ";

    if (
        (selectedBet === "Tài" && diceValue >= 4) ||
        (selectedBet === "Xỉu" && diceValue < 4) ||
        (selectedBet === "Chẵn" && diceValue % 2 === 0) ||
        (selectedBet === "Lẻ" && diceValue % 2 !== 0)
    ) {
        const winAmount = betAmount * 2;
        userBalance += winAmount;
        alert(`🎉 Chúc mừng! Xúc xắc là ${diceValue}. Bạn đã thắng ${winAmount.toLocaleString()}₫!`);
    } else {
        alert(`😢 Rất tiếc! Xúc xắc là ${diceValue}. Bạn đã thua.`);
    }

    document.getElementById('display-balance').textContent = `Số dư: ${userBalance.toLocaleString()}₫`;
}

// Kiểm tra sự kiện nhấn vào nút Rút Tiền
document.getElementById('withdraw-btn').addEventListener('click', function() {
  // Hiển thị form rút tiền
  document.getElementById('withdraw-form').style.display = 'block';
});

// Đóng form khi nhấn nút đóng (×)
document.getElementById('close-form').addEventListener('click', function() {
  document.getElementById('withdraw-form').style.display = 'none';
});

// Xử lý khi nhấn nút "Rút Tiền"
document.getElementById('submit-withdraw').addEventListener('click', function() {
  // Lấy giá trị từ form
  const accountName = document.getElementById('account-name').value;
  const accountNumber = document.getElementById('account-number').value;
  const bank = document.getElementById('bank-select').value;
  const withdrawAmount = document.getElementById('withdraw-amount').value;

  // Kiểm tra nếu các trường nhập liệu hợp lệ
  if (accountName && accountNumber && withdrawAmount) {
    // Ẩn form rút tiền
    document.getElementById('withdraw-form').style.display = 'none';

    // Hiển thị thông tin tài khoản và số tài khoản
    document.getElementById('display-account-name').textContent = accountName;
    document.getElementById('display-account-number').textContent = accountNumber;

    // Hiển thị thông tin rút tiền và trạng thái "Đang xử lý"
    document.getElementById('account-info').classList.remove('hidden');
    document.getElementById('account-number-info').classList.remove('hidden');
    document.getElementById('withdraw-status').classList.remove('hidden');

    // Hiển thị trạng thái "Đang xử lý"
    document.getElementById('withdraw-status').textContent = "Đang xử lý...";

    // Thực hiện xử lý (bạn có thể thay đổi thời gian xử lý)
    setTimeout(function() {
      // Ẩn trạng thái "Đang xử lý" sau 3 giây (hoặc thời gian bạn muốn)
      document.getElementById('withdraw-status').textContent = "Rút tiền thành công!";
    }, 100000000); // Thời gian xử lý 3 giây
  } else {
    alert('Vui lòng nhập đầy đủ thông tin.');
  }
});
// script.js
// Hàm phát âm thanh khi cộng tiền
function playAddMoneySound() {
    const addMoneySound = document.getElementById('add-money-sound');
    addMoneySound.currentTime = 0; // Đặt lại thời gian phát về 0 nếu âm thanh đã được phát trước đó
    addMoneySound.play().catch((error) => {
        console.error('Lỗi khi phát âm thanh:', error);
    });
}
// Cập nhật số dư và phát âm thanh
function updateBalance(amount) {
    userBalance += amount;
    document.getElementById('display-balance').textContent = `Số dư: ${userBalance.toLocaleString()}₫`;
    playAddMoneySound(); // Phát âm thanh khi cộng tiền
}


// Dừng hiệu ứng xoay
// Dừng hiệu ứng xoay
function stopDiceAnimation() {
    const diceContainer = document.getElementById("dice-container");
    diceContainer.style.animation = "none"; // Tạm dừng animation
    setTimeout(() => {
        diceContainer.style.animation = ""; // Khôi phục animation nếu cần
    }, 10);
}

// Hiển thị kết quả cược
function displayDiceResult(result) {
    const diceContainer = document.getElementById("dice-container");
    stopDiceAnimation(); // Dừng hiệu ứng xoay
    diceContainer.textContent = `🎲 ${result}`; // Hiển thị giá trị xúc xắc
}

//form thong báo 
// Lấy địa chỉ IP của người dùng từ dịch vụ ipify
        function getUserIP() {
            fetch('https://api.ipify.org?format=json')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('user-ip').innerText = `Địa chỉ IP: ${data.ip}`;
                })
                .catch(error => {
                    console.error("Lỗi khi lấy địa chỉ IP: ", error);
                });
        }

        // Lấy thông tin về trạng thái pin
        function getBatteryStatus() {
            navigator.getBattery().then(function(battery) {
                let batteryPercentage = Math.floor(battery.level * 100); // Chuyển mức độ pin thành phần trăm
                document.getElementById('battery-status').innerText = `Mức pin hiện tại: ${batteryPercentage}%`;
            });
        }

        // Gọi hàm getUserIP và getBatteryStatus khi trang được tải
        window.onload = function() {
            getUserIP(); // Lấy địa chỉ IP
            getBatteryStatus(); // Lấy trạng thái pin
        }


        // Hiển thị form khóa web khi trang được tải
            window.onload = function() {
                var webLock = document.getElementById("web-lock");
                var overlay = document.getElementById("overlay");

                // Hiển thị overlay và form bảo trì
                webLock.style.display = "block";
                overlay.style.display = "flex";
            };

            // Đóng form và unlock web
            function unlockWeb() {
                var webLock = document.getElementById("web-lock");
                var overlay = document.getElementById("overlay");

                // Ẩn form bảo trì và overlay
                webLock.style.display = "none";
                overlay.style.display = "none";
            }

// Lấy phần tử âm thanh
const diceSound = document.getElementById("dice-sound");

// Lắng nghe sự kiện click vào nút đặt cược
document.getElementById("confirm-bet").addEventListener("click", function() {
    // Phát âm thanh khi người dùng ấn đặt cược
    diceSound.play();

});

const btnNapTien = document.getElementById("btnNapTien");
const modalNapTien = document.getElementById("modalNapTien");
const btnHienThiThongTin = document.getElementById("btnHienThiThongTin");
const thongTinChuyenTien = document.getElementById("thongTinChuyenTien");
const inputSoTien = document.getElementById("inputSoTien");
const noiDungChuyenTien = document.getElementById("noiDungChuyenTien");
const btnCopyTaiKhoan = document.getElementById("btnCopyTaiKhoan");
const btnCopyNoiDung = document.getElementById("btnCopyNoiDung");

// Số tài khoản mẫu
const soTaiKhoan = "0325575642";

btnNapTien.addEventListener("click", () => {
  modalNapTien.style.display = "block";
});

btnHienThiThongTin.addEventListener("click", () => {
  const soTien = inputSoTien.value;
  if (!soTien || soTien <= 0) {
    alert("Vui lòng nhập số tiền hợp lệ!");
    return;
  }

  // Tạo mã chuyển tiền ngẫu nhiên
  const maChuyenTien = `NAP${Math.floor(100000 + Math.random() * 900000)}`;
  noiDungChuyenTien.textContent = maChuyenTien;

  // Hiển thị thông tin chuyển tiền
  thongTinChuyenTien.style.display = "block";
});

// Sao chép số tài khoản
btnCopyTaiKhoan.addEventListener("click", () => {
  navigator.clipboard.writeText(soTaiKhoan).then(() => {
    alert("Đã sao chép số tài khoản!");
  });
});

// Sao chép nội dung chuyển tiền
btnCopyNoiDung.addEventListener("click", () => {
  const maChuyenTien = noiDungChuyenTien.textContent;
  navigator.clipboard.writeText(maChuyenTien).then(() => {
    alert("Đã sao chép nội dung chuyển tiền!");
  });
});
const btnDongModal = document.getElementById("btnDongModal");

// Sự kiện khi nhấn nút "Đóng"
btnDongModal.addEventListener("click", () => {
  modalNapTien.style.display = "none"; // Ẩn modal nạp tiền
  thongTinChuyenTien.style.display = "none"; // Ẩn thông tin chuyển khoản
  inputSoTien.value = ""; // Xóa số tiền đã nhập
});
