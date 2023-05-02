import './Footer.css'
import logo from '/src/assets/logo.svg'

export default function Footer(){
    return <div className="Footer">
        <img src={logo} />
        <div className='footer-row'>
            <p>Made by Christopher Ruud Saimplice</p>
            <p>View Linkedin</p>
        </div>

    </div>
}