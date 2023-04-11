import React from 'react';
import { useTranslation } from 'next-i18next';
import { NextPage } from 'next';
import { Formik, Form, ErrorMessage } from 'formik';
import { useRouter } from 'next/router';
import * as Sentry from '@sentry/browser';
import styled from 'styled-components';
import { API } from '../../../api';
import { TextInput } from '../../../components/common/Inputs';
import { LogRegBtn } from '../../../components/common/Buttons';
import { CenteredTitle, CenteredText } from '../../../components/common/Text';
import {
  ErrorLabel,
  CustomContainer,
} from '../../../components/common/Miscellanea';
import PageTitle from '../../../components/common/BrowserPageTitle';
import { withAuthSync } from '../../../utils/auth';

const ResetPassFormPage: NextPage = () => {
  const router = useRouter();
  const { t } = useTranslation('profile');

  return (
    <ResetPasswordContainer>
      <PageTitle>{t('profile:resetPassword') as string}</PageTitle>
      <CenteredTitle>{t('profile:resetYourPassword') as string}</CenteredTitle>
      <CenteredText>{t('profile:pleaseFillInPassword') as string}</CenteredText>
      <Formik
        initialValues={{
          email: '',
          token: (router.query && router.query.tokenId) || '',
          password: '',
          password_confirmation: '',
        }}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          setSubmitting(true);
          try {
            const successfulReset = await API.authentication.confirmResetPassword(
              values.email,
              values.token as string,
              values.password,
              values.password_confirmation,
            );
            if (successfulReset && router) {
              router.push('/login');
            }
          } catch (err) {
            const defaultMessage = 'Something went wrong';

            const serverErrors =
              err.response &&
              err.response.data &&
              (err.response.data.errors || err.response.data.data);

            if (serverErrors) {
              setErrors(serverErrors);
            } else {
              setErrors({ email: defaultMessage });
              Sentry.captureException(err);
            }
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <ErrorMessage name="email" component={ErrorLabel} />

            <TextInput
              type="email"
              name="email"
              placeholder={t('profile:yourEmail') as string}
            />
            <ErrorMessage name="password" component={ErrorLabel} />
            <TextInput
              type="password"
              name="password"
              placeholder={t('profile:fillInNewPassword')}
            />
            <ErrorMessage name="password_confirmation" component={ErrorLabel} />
            <TextInput
              type="password"
              name="password_confirmation"
              placeholder={t('profile:confirmNewPassword') as string}
            />
            <LogRegBtn disabled={isSubmitting} type="submit">
              {t('profile:submit') as string}
            </LogRegBtn>
          </Form>
        )}
      </Formik>
    </ResetPasswordContainer>
  );
};

const ResetPasswordContainer = styled(CustomContainer)`
  max-width: 535px;
`;

export default withAuthSync(ResetPassFormPage);
