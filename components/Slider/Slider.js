
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs';

function Slider({images, className}) {
    return (
        <div className={className}>
            {images && images.length > 0 && (
                <div id="carouselExampleControls"  className="carousel slide" data-ride="carousel">
                    <div className="carousel-inner">
                    {images.map((img, i) => (
                        <div className={`carousel-item ${i === 0 && 'active'}`} key={img}>
                            <img className="d-block w-100" src={`/img/banners/${img}.jpg`} alt={`banner ${i + 1}`}/>
                        </div>
                    ))}
                    </div>
                    <div style={{position: 'absolute', top: '18%', width: '100%', display: 'flex', justifyContent:'space-between', alignItems: 'center', padding: '0 107px'}}>
                        <a href="#carouselExampleControls" role="button" data-slide="prev">
                            <BsChevronLeft style={{color: 'black', fontSize: "40px"}}/>
                            <span className="sr-only">Previous</span>
                        </a>
                        <a href="#carouselExampleControls" role="button" data-slide="next">
                            <BsChevronRight style={{color: 'black', fontSize: "40px"}}/>
                            <span className="sr-only">Next</span>
                        </a>
                    </div> 
                </div>   
            )}         
        </div>
    )
}

export default Slider
