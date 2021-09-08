import {
  LockOutlined,
  MobileOutlined,
} from '@ant-design/icons';
import { message, } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormCaptcha, ProFormText } from '@ant-design/pro-form';
import { Card } from 'antd';
import { useIntl, Link, history, FormattedMessage, useModel } from 'umi';
import { login } from '@/services/ant-design-pro/api';
import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import styles from './index.less';
import bgImg from '../../../assets/image/backiee-89041.jpg';


const Login = () => {
  const [submitting, setSubmitting] = useState(false);
  const { initialState, setInitialState } = useModel('@@initialState');
  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();

    if (userInfo) {
      await setInitialState((s) => ({ ...s, currentUser: userInfo }));
    }
  };

  const handleSubmit = async (values) => {
    console.log(values);
    setSubmitting(true);
    const type = 'mobile'
    try {
      // 登录
      const msg = await login({ ...values, type });

      if (msg.status === 'ok') {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        /** 此方法会跳转到 redirect 参数所在的位置 */

        if (!history) return;
        const { query } = history.location;
        const { redirect } = query;
        history.push(redirect || '/');
        return;
      } // 如果失败去设置用户错误信息
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      message.error(defaultLoginFailureMessage);
    }

    setSubmitting(false);
  };
  const contentStyle = {
    backgroundImage: 'url(' + bgImg + ')'//图片的路径
  }
  const bodyStyle = {
    backgroundColor:'#12111F',
    boxShadow: '0 0 4px #fff',
    border:'1px solid #745BD0',
  }
  return (
    <div className={styles.container}>
      <div className={styles.content} style={contentStyle}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <span className={styles.title}>Gauche 楽 后台管理系统</span>
            </Link>
          </div>
          <div className={styles.desc} />
        </div>
        <Card bodyStyle={bodyStyle} bordered={false}>
          <div className={styles.main}>
            <ProForm
              initialValues={{
                autoLogin: true,
                email: '2209102475@qq.com',
                captcha: '123456'
              }}
              submitter={{
                searchConfig: {
                  submitText: intl.formatMessage({
                    id: 'pages.login.submit',
                    defaultMessage: '登录',
                  }),
                },
                render: (_, dom) => dom.pop(),
                submitButtonProps: {
                  loading: submitting,
                  size: 'large',
                  style: {
                    width: '100%',
                  },
                },
              }}
              onFinish={async (values) => {
                await handleSubmit(values);
              }}
            >
              <ProFormText
                name="email"
                placeholder={intl.formatMessage({
                  id: 'pages.login.emailNumber.placeholder',
                  defaultMessage: '邮箱',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.emailNumber.required"
                        defaultMessage="请输入QQ邮箱！"
                      />
                    ),
                  },
                  {
                    pattern: /^[1-9][0-9]{4,10}@qq.com$/,
                    message: (
                      <FormattedMessage
                        id="pages.login.emailNumber.invalid"
                        defaultMessage="QQ邮箱格式错误！"
                      />
                    ),
                  },
                ]}
              />
              <ProFormCaptcha
                captchaProps={{
                  size: 'large',
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.captcha.placeholder',
                  defaultMessage: '请输入验证码',
                })}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${intl.formatMessage({
                      id: 'pages.getCaptchaSecondText',
                      defaultMessage: '获取验证码',
                    })}`;
                  }

                  return intl.formatMessage({
                    id: 'pages.login.phoneLogin.getVerificationCode',
                    defaultMessage: '获取验证码',
                  });
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.captcha.required"
                        defaultMessage="请输入验证码！"
                      />
                    ),
                  },
                ]}
                onGetCaptcha={async (phone) => {
                  const result = await getFakeCaptcha({
                    phone,
                  });

                  if (result === false) {
                    return;
                  }

                  message.success('获取验证码成功！验证码为：1234');
                }}
              />
            </ProForm>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
