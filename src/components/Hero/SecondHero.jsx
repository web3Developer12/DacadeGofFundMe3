import './SecondHero.css'

export default function SecondHero(){
    return <div className="SecondHero">
        
        <p>What to expect</p>
        <p data-aos="fade-up" data-aos-duration="700">Fundraising on GoFundMe<br/>takes just a few minutes</p>

        <div className="cardHeroGroup">
            <div className="cardHero">
                <div className="cardCounter" data-aos="fade-up" data-aos-duration="400">1</div>
                <div className="cardHeroBottom">
                    <p data-aos="fade-in" data-aos-duration="700">Start with the basics</p>
                    <p data-aos="fade-in" data-aos-duration="900">Kick things off with your name and location.</p>
                </div>
            </div>
            <div className="cardHero">
                <div className="cardCounter" data-aos="fade-up" data-aos-duration="400">2</div>
                <div className="cardHeroBottom">
                    <p data-aos="fade-in" data-aos-duration="700">Tell your story</p>
                    <p data-aos="fade-in" data-aos-duration="900">We'll guide you with tips along the way.</p>
                </div>
            </div>
            <div className="cardHero">
                <div className="cardCounter" data-aos="fade-up" data-aos-duration="400">3</div>
                <div className="cardHeroBottom">
                    <p data-aos="fade-in" data-aos-duration="700">Share with friends and family</p>
                    <p data-aos="fade-in" data-aos-duration="900">People out there want to help you.</p>
                </div>
            </div>

        </div>
    </div>
}