import React, { Component } from 'react';
import { Carousel } from 'antd';

import './home.css';
import p1 from '../static_files/fintech1.png';
import p2 from '../static_files/fintech2.png';
import p3 from '../static_files/fintech3.png';

class Home extends Component {
    render() {
        const pictures = [ p1, p2, p3 ];

        return (
            <div className="container">
                <Carousel autoplay >
                    {pictures.map((p, i) => <img src={p} alt="picture" key={i} />)}
                </Carousel>
            </div>
            
        );
    }
}

export default Home;
