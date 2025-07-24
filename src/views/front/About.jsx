import Banner from '../../components/Banner';
import bannerImg2 from '../../assets/images/banner/banner2.jpeg';
import '../../assets/styles/pages/_about.scss';
import useScreenSize from '../../hooks/useScreenSize';
import timeLineData from '../../data/timeLineData.js';
import boatbloghero from '../../assets/images/about/about-hero.jpeg';
import community from '../../assets/images/about/community.jpeg';
import education from '../../assets/images/about/education.jpeg';

const About = () => {

    // RWD:自訂hook
    const { isMobile, isTablet, isDesktop } = useScreenSize();

    const getFontSize = () => {
        if (isMobile) return 'h6';
        if (isTablet) return 'h5';
        return 'h4';  // desktop
    };

    return (
        <section className='aboutPage'>
            {/* Banner 區塊 */}
            <Banner 
                imgSrc={bannerImg2} 
                alt='產品列表 Banner' 
                className='about-banner' 
                title='關於旅人集所' 
                content='我們不只販售裝備，更想陪你完成一場說走就走的旅程' 
            />

            {/* Timeline 區塊 */}
            <div className='pb-10 pt-10 px-5'>
                <div className="container">
                    <div className={`${isMobile ? 'h4' : 'h3'} text-center pb-5`}>
                        <span>—— 品牌年表 ——</span>
                    </div>
                    <ul className="timeLine">
                        {timeLineData.map((item) => (
                            <li key={item.title} className="row align-items-start">
                                <div className="col-auto timeLineYear-col">
                                    <span className= "timeLineYear fs-5">
                                        {item.year}
                                    </span>
                                </div>
                                <div className="col-auto dash-line-col">
                                    <span className="dash-line"></span>
                                </div>
                                <div className="col content-col">
                                    <p className="title h6">
                                        {item.title}
                                    </p>
                                    <p className= "content fs-6">
                                        {item.content}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="section-bg-blue pb-10 pt-10">
                <div className="container">
                    <div className='text-center'>
                        <div className={`${isMobile ? 'h4' : 'h3'}`}>—— 關於旅人集所 ——</div>
                        <div className={`${isMobile ? 'h6' : 'h5'} py-4 subtitle`}>旅行的起點，從打包開始</div>
                    </div>
                    <div className={`about-content ${isMobile ? 'fs-6' : 'fs-5'} px-5`}>
                        <p>
                            旅人集所的品牌名稱，取自於「旅人」與「集所」兩個字，象徵著我們的產品是為了旅行而設計的，並且是旅行者們的集結地。
                            我們相信，旅行不僅僅是到達目的地，更是一段充滿探索與發現的旅程。因此，我們致力於提供最優質的旅行用品，讓每一位旅人都能在旅途中感受到舒適與便利。
                        </p>
                        <p>
                            我們的產品設計靈感來自於旅行中的各種需求，無論是行李箱、背包、旅行配件等，我們都希望能夠滿足每一位旅人的需求。
                            我們的產品不僅僅是實用的工具，更是旅行中不可或缺的夥伴，陪伴著每一位旅人走過每一段旅程。
                        </p>
                        <img
                            className='about-img'
                            src={boatbloghero}
                            alt="關於旅人集所 Hero"
                        />
                    </div>
                </div>
            </div>
            <div className="pb-10 pt-10">
                <div className={`text-center ${isMobile ? 'h4' : 'h3'}`}>—— 社會責任 ——</div>
                <div className="container csr-section px-5">
                    <div className='row gy-5 py-5'>
                        {/* 推動旅行教育 */}
                        <div className='col-12 col-md-6 col-lg-4 image-section'>
                            <img 
                                className='csr-img'
                                src={education}
                                alt="推動旅行教育" 
                            />
                        </div>
                        <div className='col-12 col-md-6 col-lg-8 text-section'>
                            <div className={`${isMobile ? 'h6' : 'h5'} csr-title subtitle mb-2`}>推動旅行教育</div>
                            <div className={`${isMobile ? 'fs-6' : 'fs-5'} csr-content mb-2`}>
                                我們認為，旅行不僅是移動，更是一種學習和探索的機會。旅人集所致力於推廣旅行教育，分享旅行整理技巧，目的地文化知識，並幫助旅行者養成規劃和收納的能力。
                            </div>
                            <ul className={`${isMobile ? 'fs-6' : 'fs-5'} csr-content mb-2`}>
                                <li>• 社群分享免費旅行攻略和收納技巧</li>
                                <li>• 舉辦線上與線下的旅行講座，邀請專家分享保有旅行和文化旅行的心得</li>
                            </ul>
                        </div>
                    </div>
                        
                    {/* 支持弱勢，回饋社會 */}
                    <div className='row gy-5'>
                        <div className='col-12 col-md-6 col-lg-4 image-section'>
                            <img 
                                className='csr-img'
                                src={community}
                                alt="推動旅行教育" 
                            />
                        </div>
                        <div className='col 12 col-md-6 col-lg-8 text-section'>
                            <div className={`${isMobile ? 'h6' : 'h5'} csr-title subtitle  mb-2`}>支持弱勢，回饋社會</div>
                            <div className={`${isMobile ? 'fs-6' : 'fs-5'} csr-content mb-2`}>
                                我們相信旅行應該是一種人人都能享受的自由。旅人集所每年捐贈部分收益，用於支持弱勢家庭和偏遠地區的教育與旅遊體驗計劃，幫助更多人感受到旅行的美好。
                            </div>
                            <ul className={`${isMobile ? 'fs-6' : 'fs-5'} csr-content mb-2`}>
                                <li>• 與社福團體合作，為弱勢家庭提供旅行所需的基本裝備</li>
                                <li>• 推動「探索世界」專案，資助偏遠地區的孩子參與文化交流活動</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default About;