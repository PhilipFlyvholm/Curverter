import icon from "data-base64:~../assets/icon.png"
function Header() {
  return (
    <>
      <div id="header">
        <img src={icon} alt="" width={30} height={30} />
        <h1>curverter</h1>
      </div>

    </>
  )
}

export default Header
