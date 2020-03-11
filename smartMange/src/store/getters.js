const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  permission_routes: state => state.permission.routes,
  RightsList:state => state.user.RightsList,
  MenuButton:state => state.user.MenuButton
}

export default getters
