import React, { Component } from 'react';
import axios from "axios";
import {Link} from "react-router-dom";

export default class Confirmation extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      success: null,
      error: null,
    };
  }
  
  componentDidMount() {
    const token = this.props.match.params.token;
    
    axios.post('/api/confirm', {
      verificationToken: token
    }).then(() => {
      this.setState({
        success: true,
      });
    }).catch(error => {
      this.setState({
        error: error.response.data.error,
      });
    });
  }
  
  render() {
    const { success, error } = this.state;
    
    if (success) {
      return (
        <div className="text-center border border-light p-5">
          <p className="h4 mb-4">Поздравляем, ваш почтовый адрес успешно подтвержден!</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="text-center border border-light p-5">
          <p className="text-danger">При выполнени операции произошла ошибка.</p>
          <p className="text-danger">{error}</p>
          <Link to="/">Регистрация</Link>
        </div>
      );
    }
    
    return (
      <div className="row login-form justify-content-center align-items-center">
        <div className="col col-md-6">
          <div className="text-center border border-light p-5">
            <p className="h4 mb-4">Подтверждение почтового адреса</p>
            <p>Почтовый адрес подтверждается, пожалуйста, подождите.</p>
            <div className="spinner-border" role="status">
              <span className="sr-only">Загрузка...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
