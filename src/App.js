import React, {lazy, Suspense} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';

import './App.css';

import {default as Header} from './components/header/header.container';

import {auth, createUserProfileDocument} from './firebase/firebase.utils';

import {setCurrentUser} from './redux/user/user.actions';
import {selectCurrentUser} from './redux/user/user.selectors';

const HomePage = React.lazy(() =>
    import("./pages/homepage/homepage.component").then(() => ({
        default: HomePage,
    }))
);
const ShopPage = lazy(() => import('./pages/shop/shop.component').then(() => ({default: ShopPage})));
const CheckoutPage = lazy(() => import('./pages/checkout/checkout.component').then(() => ({default: CheckoutPage})));
const SignInAndSignUpPage = lazy(() => import('./pages/sign-in-and-sign-up/sign-in-and-sign-up.component').then(() => ({default: SignInAndSignUpPage})));

class App extends React.Component {
    unsubscribeFromAuth = null;

    componentDidMount() {
        const {setCurrentUser} = this.props;

        this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
            if (userAuth) {
                const userRef = await createUserProfileDocument(userAuth);

                userRef.onSnapshot(snapShot => {
                    setCurrentUser({
                        id: snapShot.id,
                        ...snapShot.data()
                    });
                });
            }

            setCurrentUser(userAuth);
        });
    }

    componentWillUnmount() {
        this.unsubscribeFromAuth();
    }

    render() {
        return (
            <div>
                <Header/>
                <Switch>
                    <Suspense fallback={<div>Loading</div>}>
                        <Route exact path='/' component={HomePage}/>
                        <Route exact path='/checkout' component={CheckoutPage}/>
                        <Route
                            exact
                            path='/signin'
                            render={() =>
                                this.props.currentUser ? (
                                    <Redirect to='/'/>
                                ) : (
                                    <SignInAndSignUpPage/>
                                )
                            }
                        />
                        <Route path='/shop' component={ShopPage}/>
                    </Suspense>
                </Switch>
            </div>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser
});

const mapDispatchToProps = dispatch => ({
    setCurrentUser: user => dispatch(setCurrentUser(user))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
