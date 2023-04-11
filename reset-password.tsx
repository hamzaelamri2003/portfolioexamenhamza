import React, { useState } from 'react';

import styled from 'styled-components';

import { Formik, Form, ErrorMessage } from 'formik';
import { useTranslation } from 'next-i18next';
import { API, style } from '../api';
import Link from '../components/common/Link';
import { TextInput } from '../components/common/Inputs';
import Modal from '../components/common/Modal';
import Confirm from '../components/Modals/Confirm';

import { LogRegBtn } from '../components/common/Buttons';
import { CenteredTitle, Text } from '../components/common/Text';
import { ErrorLabel, CustomContainer } from '../components/common/Miscellanea';
import PageTitle from '../components/common/BrowserPageTitle';
import { withAuthSync } from '../utils/auth';
import { noDesktop } from '../style/constants';
import Logo from '../components/common/Logo';

const ResetPassword = () => {
  const { t } = useTranslation('profile');
  const [jopa, setJopa] = useState(false);

  return (
    <>
      <PageTitle>{t('profile:resetPassword')}</PageTitle>
      <Modal isOpened={jopa} toggle={setJopa}>
        <Confirm
          callback={() => {
            setJopa(false);
          }}
          message={t('profile:resetLinkHasBeenSend') as string}
        />
      </Modal>
      <ResetPasswordContainer>
        <PasswordContainer>
          <VirppLogo />
          <CenteredTitle>{t('profile:forgotPassword')}</CenteredTitle>
          <Text fontSize="14px" mb="35px" textAlign="center">
            {t('profile:pleaseEnterEmail')}
          </Text>
          <Formik
            initialValues={{
              email: '',
            }}
            onSubmit={async (values, { setSubmitting, setErrors }) => {
              setSubmitting(true);
              try {
                await API.authentication.resetPassword(values.email);
                setJopa(true);
              } catch (err) {
                const data = err.response?.data;
                const defaultMessage = t('profile:errorMsg');
                const serverErrors = data.errors || data.data;
                if (serverErrors && serverErrors.email) {
                  setErrors({ email: serverErrors.email });
                } else {
                  setErrors({ email: defaultMessage });
                }
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <StyledForm>
                <ErrorMessage name="email" component={ErrorLabel} />
                <TextInput
                  type="email"
                  name="email"
                  placeholder={t('profile:emailAddress')}
                />
                <LogRegBtn disabled={isSubmitting} type="submit">
                  {t('profile:sendPassword')}
                </LogRegBtn>
                <Text
                  fontSize="12px"
                  color={style.grey_dark_new}
                  margin="18px auto"
                >
                  {t('profile:notYetRegistered')}
                </Text>
                <Link className="redGhostBtn" href="/register">
                  <RegisterNowButton>
                    {t('profile:createAnAccountNow')}
                  </RegisterNowButton>
                </Link>
              </StyledForm>
            )}
          </Formik>
        </PasswordContainer>
      </ResetPasswordContainer>
    </>
  );
};

const VirppLogo = styled(Logo)`
  padding: 30px 0;
  margin-bottom: 30px;
  border-bottom: 1px solid ${style.grey_light_1_new};
`;

const PasswordContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  h1 {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 15px;
  }

  button {
    width: 100%;
    margin-top: 15px;
  }

  @media ${noDesktop} {
    margin-top: -30px;
    padding: 0 30px;
  }
`;

export default withAuthSync(ResetPassword);

const ResetPasswordContainer = styled(CustomContainer)`
  width: 350px;
`;

const StyledForm = styled(Form)`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const RegisterNowButton = styled.button`
  display: inline-block;
  width: 100%;
  padding: 10px 0;
  border: 2px solid ${style.primary_pink_new};
  color: ${style.primary_pink_new};
  background-color: ${style.white};
  display: flex;
  justify-content: center;
  align-items: center;
`;
