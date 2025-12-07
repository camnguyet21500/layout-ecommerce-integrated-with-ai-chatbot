const BASE_URL = "https://ecommerce-integrated-with-ai-chatbot.onrender.com/api";
let authToken = null;
let currentUsers = []; // Biến lưu danh sách user hiện tại

async function autoLoginAndLoad() {
    try {
        console.log("Đang đăng nhập tự động...");
        const loginRes = await fetch(`${BASE_URL}/auth/sign-in`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: "nvo28@example.com", password: "nvo28" })
        });
        const loginData = await loginRes.json();
        if (loginData.data?.accessToken) {
            authToken = loginData.data.accessToken;
            console.log("Đăng nhập thành công!");
            loadUsers();
        } else {
            alert("Không đăng nhập được – kiểm tra email/pass");
        }
    } catch (err) {
        console.error("Lỗi login:", err);
        alert("Không kết nối được server");
    }
}

async function loadUsers() {
    try {
        const res = await fetch(`${BASE_URL}/users?itemPerPage=100&page=1`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok && res.status === 401) {
            alert("Token hết hạn, đang đăng nhập lại...");
            return autoLoginAndLoad();
        }
        if (!res.ok) throw new Error("Lỗi server");

        const json = await res.json();
        const activeUsers = json.data.list.filter(user => !user.deletedAt);
        currentUsers = activeUsers; // Lưu vào biến toàn cục
        renderTable(currentUsers);
    } catch (err) {
        console.error(err);
        document.querySelector("tbody").innerHTML = "<tr><td colspan='8' class='text-danger text-center'>Lỗi tải dữ liệu</td></tr>";
    }
}

function renderTable(users) {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    if (!users || users.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center py-5 text-muted">Không có người dùng nào</td></tr>`;
        return;
    }

    // Sắp xếp: cũ nhất trên đầu → mới nhất dưới cùng
    users.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));

    users.forEach((user, index) => {
        const fullName = [(user.firstName || ""), (user.lastName || "")].filter(Boolean).join(" ").trim();
        const displayName = fullName || user.email.split('@')[0];
        const createdDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '-';

        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="text-center font-weight-bold" style="width:60px;">${index + 1}</td>
            <td>${displayName}</td>
            <td>${user.fullAddress || "-"}</td>
            <td>${user.email}</td>
            <td>${user.phone || "-"}</td>
            <td><span class="badge badge-${user.status === 'active' ? 'success' : 'secondary'}">${user.status || 'unknown'}</span></td>
            <td><span class="badge badge-info">${createdDate}</span></td>
            <td class="text-center" style="width:130px;">
                <button class="btn btn-sm btn-primary mr-1 edit-btn" data-user='${JSON.stringify(user)}' data-toggle="modal" data-target="#editUserModal">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${user.id}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// THÊM USER – CHỈ GIỮ LẠI ĐOẠN DUY NHẤT NÀY
$('#addUserForm').on('submit', async function (e) {
    e.preventDefault();

    const payload = {
        email: $('#email').val().trim(),
        password: $('#password').val(),
        firstName: $('#firstName').val().trim(),
        lastName: $('#lastName').val().trim() || null,
        fullAddress: $('#fullAddress').val().trim(),
        city: $('#city').val().trim() || null,
        province: $('#province').val().trim() || null,
        country: $('#country').val().trim() || "Việt Nam",
        phone: $('#phone').val().trim() || null,
        status: $('#status').is(':checked') ? 'active' : 'inactive'
    };

    $('#btnSaveNewUser').prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Đang lưu...');

    try {
        const res = await fetch(`${BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(payload)
        });

        if (res.status === 200 || res.status === 201) {
            const result = await res.json();
            const newUser = result.data;

            alert("Thêm người dùng thành công!");
            $('#addUserModal').modal('hide');
            $('#addUserForm')[0].reset();

            // THÊM NGAY USER MỚI VÀO DANH SÁCH VÀ RERENDER
            currentUsers.push(newUser);
            renderTable(currentUsers);

        } else {
            const err = await res.json();
            alert("Thêm thất bại: " + (err.message || "Lỗi không xác định"));
        }
    } catch (err) {
        console.error(err);
        alert("Lỗi kết nối server!");
    } finally {
        $('#btnSaveNewUser').prop('disabled', false).html('<i class="fas fa-save"></i> Lưu người dùng');
    }
});

// Khi bấm nút Edit → điền dữ liệu vào form
$(document).on('click', '.edit-btn', function () {
    const user = JSON.parse($(this).attr('data-user'));

    $('#editUserId').val(user.id);
    $('#editEmail').val(user.email);
    $('#editPassword').val(''); // luôn để trống
    $('#editFirstName').val(user.firstName || '');
    $('#editLastName').val(user.lastName || '');
    $('#editFullAddress').val(user.fullAddress || '');
    $('#editCity').val(user.city || '');
    $('#editProvince').val(user.province || '');
    $('#editCountry').val(user.country || 'Việt Nam');
    $('#editPhone').val(user.phone || '');
    $('#editStatus').prop('checked', user.status === 'active');

    $('#editUserModal').modal('show');
});

// Khi bấm Cập nhật
$('#editUserForm').on('submit', async function (e) {
    e.preventDefault();

    const userId = $('#editUserId').val();
    const payload = {
        email: $('#editEmail').val().trim(),
        firstName: $('#editFirstName').val().trim(),
        lastName: $('#editLastName').val().trim() || null,
        fullAddress: $('#editFullAddress').val().trim(),
        city: $('#editCity').val().trim() || null,
        province: $('#editProvince').val().trim() || null,
        country: $('#editCountry').val().trim() || "Việt Nam",
        phone: $('#editPhone').val().trim() || null,
        status: $('#editStatus').is(':checked') ? 'active' : 'inactive'
    };

    // Chỉ thêm password nếu người dùng nhập
    const newPassword = $('#editPassword').val().trim();
    if (newPassword) payload.password = newPassword;

    $('#btnUpdateUser').prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Đang cập nhật...');

    try {
        const res = await fetch(`${BASE_URL}/users/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(payload)
        });

        if (res.status === 200 || res.status === 201) {
            const result = await res.json();
            const updatedUser = result.data;

            alert("Cập nhật thành công!");

            // Cập nhật ngay trong mảng currentUsers
            const index = currentUsers.findIndex(u => u.id === userId);
            if (index !== -1) currentUsers[index] = updatedUser;

            // Render lại bảng (giữ thứ tự createdAt)
            renderTable(currentUsers);

            $('#editUserModal').modal('hide');
        } else {
            const err = await res.json();
            alert("Cập nhật thất bại: " + (err.message || "Lỗi server"));
        }
    } catch (err) {
        console.error(err);
        alert("Lỗi kết nối server!");
    } finally {
        $('#btnUpdateUser').prop('disabled', false).html('<i class="fas fa-save"></i> Cập nhật người dùng');
    }
});

$(document).ready(function () {
    autoLoginAndLoad();
});