import './FirstHero.css'
import sun from '../../assets/sun.svg'

export default function FirstHero(){
    return <div className='FirstHero'>
        <p data-aos="fade-up">Your home<br/>for help</p>
        <button className='d' data-aos="fade-up" data-aos-duration="1000" onClick={()=>{
             if(window.ethereum != true){

                toast.error("Install Metamask", {
                    style: {
                    border: '1px solid #eb4d4b',
                    padding: '16px',
                    color: '#eb4d4b',
                    fontFamily:"NunitoRegular"
                    },
                    iconTheme: {
                    primary: '#eb4d4b',
                    secondary: 'white',
                    },
                });

            }
        }}>
            <img src={sun} width={22}/>
            Start a GoFundMe
        </button>
    </div>
}