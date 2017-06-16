import React from 'react';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import { forceCheck } from 'react-lazyload';
import styles from './Favorite.css';
import classnames from 'classnames';
import CategoryItem from 'components/CategoryItem';
import Spinner from 'components/Spinner';
import Error from 'components/Error';

import IconButton from 'material-ui/IconButton';
import FavoriteBroIco from 'material-ui/svg-icons/action/favorite-border';

import { getOnline } from 'actions';

const onlineFiter = (item, onlines) => {
    let _target = false;

    onlines.forEach((online, index) => {
        if(online.anchor == item.anchor && online.roomId == item.roomId) _target = true; 
    })

    return _target;
}

class Favorite extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        let data = this.props.favorite;
        this.props.getOnline(data)
    }

    componentWillUnmount() {
        //document.removeEventListener('click', this.handleDocumentClick)
    }


    render() {

        let favoriteList = this.props.favorite;
        let onlineFavoriteList = this.props.online.data;
        const {loading: loading, error: error, done: done } = this.props.online;
        let favoriteHtml = [];

        if(favoriteList instanceof Array) {
            favoriteList.forEach((item, index) => {
                let online = onlineFiter(item, onlineFavoriteList);

                favoriteHtml.push(<CategoryItem favoriteStatus={true} key={item.roomId} online={online} type="search" item={item} />)
            })
        }

        let _html = favoriteHtml.length > 0 
                ? favoriteHtml 
                : <div className={styles.noContent}><Error img={require('../../../assets/followed-channels__empty.png')} content='关注频道,轻松观看您喜爱的内容。 您可能会喜欢这些内容！' /> </div>

        return (
            <div className={styles.favorite}>
                <h4>正在关注</h4>
                <div className={styles.favoriteContent}>
                    {loading ? <div style={{marginTop: '40%'}}><Spinner color="#5b6ca9" size={30} /></div> : ''}

                    { done || error ? _html : ''}

                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    online: state.online,
    favorite: state.favorite.data,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    getOnline: (data) => dispatch(getOnline(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Favorite);