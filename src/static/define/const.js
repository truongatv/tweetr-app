export const component = {
    home_member: 'HomeMember',
    personal_fee: 'PersonalFee',
    profile: 'Profile',
    home_fee: 'HomeFee'
}

export const menu = [
    { text: "Thông tin cá nhân", icon: "mdi-account", component_name: "Profile" },
    { text: "Quản lý", icon: "mdi-clock", component_name: "HomeMember" },
    { text: "Phí cá nhân", icon: "mdi-account", component_name: "PersonalFee" },
    { text: "Phí gia đình", icon: "mdi-home", component_name: "HomeFee" }
    
]

export const label = {
    full_name: 'Họ tên',
    name_product: 'Tên sản phẩm',
    date_pay: 'Ngày thanh toán',
    price: 'Gía tiền',
    payer: 'Người thanh toán',
    edit: 'Sửa',
    email: 'E-mail',
    add_new: 'Thêm mới',
    password: 'Mật khẩu',
    detail: 'Mô tả',
    add_new_member: 'Thêm thành viên',
    home_name: 'Tên nhà',
    address: 'Địa chỉ',
    beneficiary: 'Người sử dụng',
    cost_detail: 'Thông tin chi tiết',
    admin: 'Người quản lý',
    sum_money: 'Tổng tiền',
    created: 'Ngày tạo',
    updated: 'Ngày cập nhật'
}

export const button = {
    edit_member: 'Thay đổi thành viên',
    done: 'Xong',
    yes: 'Có',
    no: 'Không',
    add: 'Thêm',
    cancel: 'Đóng',
    save_edit: 'Lưu thay đổi',
    save: 'Lưu',
    edit: 'Sửa đổi thông tin'
}

export const messages = {
    error: {
        email: 'Nhập email',
        not_exist_user: 'Người dùng không tồn tại',
        user_is_ready_in_other_home: 'Người dùng đã ở một nhà nào đó!',
        required: 'Bạn cần nhập thông tin',
        need_create_home: 'Bạn cần tạo thông tin nhà ở trước'
    },
    success: {
        add_done: 'Thêm thành công',
        remove_done: 'Xóa thành công',
        remove_fail: 'Xóa thất bại',
        edit_done: 'Cập nhật thành công',
        edit_fail: 'Cập nhật thất bại',
        add_fail: 'Thêm thất bại'
    },
    alert: {
        are_you_sure_delete: 'Bạn có muốn xóa mục này không ?'
    }
}

export const fbApi = '767356600456591'