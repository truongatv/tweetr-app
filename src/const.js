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
    fullName: 'Họ tên',
    username: 'Nick name',
    name_product: 'Tên sản phẩm',
    date: 'Ngày thanh toán',
    price: 'Gía tiền',
    payer: 'Người thanh toán',
    edit: 'Sửa',
    email: 'E-mail',
    addNew: 'Thêm mới',
    password: 'Mật khẩu',
    detail: 'Mô tả',
    addNewMember: 'Thêm thành viên',
    homeName: 'Tên nhà',
    address: 'Địa chỉ'
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
        notExistUser: 'Người dùng không tồn tại',
        userIsReadyInOtherHome: 'Người dùng đã ở một nhà nào đó!',
        required: 'Bạn cần nhập thông tin',
        needCreateHome: 'Bạn cần tạo thông tin nhà ở trước'
    },
    success: {
        addDone: 'Thêm thành công'
    }
}