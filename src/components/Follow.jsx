import React       from 'react';
import { connect } from 'react-redux';
import { Link }    from 'react-router';
import classNames  from 'classnames'
import moment from 'moment'

import AppBarTimer   from './AppBarTimer';

const mapStateToProps = state => {
  return {
    orders: state.orders
  };
};

class Follow extends React.Component {
  propTypes = {
    orders: React.PropTypes.array
  };

  state = {
    tab: 'notReady'
  }

  onChangeStatusClick(order, status) {
    //this.props.changeStatus(order.id, status)
  }

  getOrders() {
    const ordersPending = this.props.orders.filter(order => order.status === "pending")
    ordersPending.sort((a, b) => {
      if (moment(a.createdAt).isAfter(b.createdAt)) return 1
      if (moment(a.createdAt).isBefore(b.createdAt)) return -1
      return 0
    })

    const ordersInPrep = this.props.orders.filter(order => order.status === "prepare")
    ordersInPrep.sort((a, b) => {
      if (moment(a.createdAt).isAfter(b.createdAt)) return 1
      if (moment(a.createdAt).isBefore(b.createdAt)) return -1
      return 0
    })

    const ordersReady = this.props.orders.filter(order => order.status === "ready")
    ordersReady.sort((a, b) => {
      if (moment(a.createdAt).isAfter(b.createdAt)) return 1
      if (moment(a.createdAt).isBefore(b.createdAt)) return -1
      return 0
    })

    return [...ordersReady, ...ordersInPrep, ...ordersPending]
  }

  changeTab(elem, tab) {
    this.setState({
      tab
    });
  }

  render() {
    const classesNotReady = classNames(
      'b-prepare__orders__tabs__tab',
      { 'b-prepare__orders__tabs__tab--active': this.state.tab === 'notReady' }
    );

    const classesReady = classNames(
      'b-prepare__orders__tabs__tab',
      { 'b-prepare__orders__tabs__tab--active': this.state.tab === 'ready' }
    );

    const orders = this.props.orders;

    // for each item, count per status and organize per category
    const ordersCounter = [];
    orders.map(order => {
      var name = order.name.charAt(0).toUpperCase() + order.name.slice(1);
      var category = order.category.charAt(0).toUpperCase() + order.category.slice(1);

      if (order.status != "ready") {
        if (category === "Canettes") {
          if (!ordersCounter[category]) {
            ordersCounter[category] = {prepare:0, pending:0}
          }
          ordersCounter[category][order.status]++;
        }

        else {
          if (!ordersCounter[name]) {
            ordersCounter[name] = {prepare:0, pending:0}
          }
          ordersCounter[name][order.status]++;
        }
      }
    })

    const ordersToDisplay = this.getOrders();

    return (
      <div className="b-prepare">
        <div className="b-prepare__title">
          <Link to="/" className="b-sell__title__back">&lsaquo;</Link>
          <AppBarTimer />
        </div>
        <div className="b-prepare__orders">
          <div className="b-prepare__orders__orders">
            {
              (ordersToDisplay.length == 0)
              ?
                <div className="b-prepare__orders__orders__empty">Aucune commande pour le moment.</div>
              :
                ordersToDisplay.map(order => {
                  if (order.id) {
                    const pendingClasses = classNames(
                      'b-prepare__orders__orders__order__status',
                      'b-prepare__orders__orders__order__pending',
                      { 'b-prepare__orders__orders__order__status--active': order.status === 'prepare' || order.status === 'ready' }
                    );

                    const prepareClasses = classNames(
                      'b-prepare__orders__orders__order__status',
                      'b-prepare__orders__orders__order__prepare',
                      { 'b-prepare__orders__orders__order__status--active': order.status === 'prepare' || order.status === 'ready' }
                    );

                    const readyClasses = classNames(
                      'b-prepare__orders__orders__order__status',
                      'b-prepare__orders__orders__order__ready',
                      { 'b-prepare__orders__orders__order__status--active': order.status === 'ready' }
                    );

                    const orderClasses = `b-prepare__orders__orders__order b-prepare__orders__orders__order--${order.status}`;

                    const orderName = order.items.length > 0 ? order.items.filter(i => i).map(i => i.name).join(', ') : order.name;
                    let code = order.code
                    if (code.startsWith('W')) code = 'Invité' + code.substr(1, code.length)
                    if (code.startsWith('X')) code = 'Visiteur' + code.substr(1, code.length)
                    if (code.startsWith('Y')) code = 'Casteur' + code.substr(1, code.length)
                    if (code.startsWith('Z')) code = 'Orga' + code.substr(1, code.length)
                    return (
                      <div className={orderClasses} ref={order.id}>
                        <div className="b-prepare__orders__orders__order__name">#{code} {order.buyerName !== order.code ? `${order.buyerFirstName} (${order.buyerName})` : null} {orderName}</div>
                        <div
                          className={pendingClasses}
                          onClick={() => this.onChangeStatusClick(order, 'pending')}>
                          Attente
                        </div>
                        <div
                          className={prepareClasses}
                          onClick={() => this.onChangeStatusClick(order, 'prepare')}>
                          Préparation
                        </div>
                        <div
                          className={readyClasses}
                          onClick={() => this.onChangeStatusClick(order, 'ready', this)}>
                          Prêt
                        </div>
                      </div>
                    );
                  }
                  else {
                    return (
                      <div className="b-prepare__orders__orders__orders">
                        {
                          order.map(order => {
                            const pendingClasses = classNames(
                              'b-prepare__orders__orders__order__status',
                              'b-prepare__orders__orders__order__pending',
                              { 'b-prepare__orders__orders__order__status--active': order.status === 'prepare' || order.status === 'ready' }
                            );

                            const prepareClasses = classNames(
                              'b-prepare__orders__orders__order__status',
                              'b-prepare__orders__orders__order__prepare',
                              { 'b-prepare__orders__orders__order__status--active': order.status === 'prepare' || order.status === 'ready' }
                            );

                            const readyClasses = classNames(
                              'b-prepare__orders__orders__order__status',
                              'b-prepare__orders__orders__order__ready',
                              { 'b-prepare__orders__orders__order__status--active': order.status === 'ready' }
                            );

                            const orderClasses = `b-prepare__orders__orders__order b-prepare__orders__orders__order--${order.status}`;

                            const orderName = order.items.length > 0 ? order.items.filter(i => i).map(i => i.name).join(', ') : order.name;

                            return (
                              <div className={orderClasses} ref={order.id}>
                                <div className="b-prepare__orders__orders__order__name">#{order.code} 
                                {order.buyerName !== order.code ? `${order.buyerFirstName} (${order.buyerName})` : null} {orderName}</div>
                                <div
                                  className={pendingClasses}
                                  onClick={() => this.onChangeStatusClick(order, 'pending')}>
                                  Attente
                                </div>
                                <div
                                  className={prepareClasses}
                                  onClick={() => this.onChangeStatusClick(order, 'prepare')}>
                                  Préparation
                                </div>
                                <div
                                  className={readyClasses}
                                  onClick={() => this.onChangeStatusClick(order, 'ready', this)}>
                                  Prêt
                                </div>
                              </div>
                            );
                          })
                        }
                      </div>
                    );
                  }
                })
            }
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(Follow);
