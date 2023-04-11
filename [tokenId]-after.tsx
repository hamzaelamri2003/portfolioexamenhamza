import React from 'react';
import { useTranslation } from 'next-i18next';
import { NextPage } from 'next';
import { Formik, Form, ErrorMessage } from 'formik';
import { useRouter } from 'next/router';
import * as Sentry from '@sentry/browser';
import styled from 'styled-components';
import { API } from '../../../api';
import { CenteredText } from '../../../components/common/Text';
import {
  ErrorLabel,
  CustomContainer,
} from '../../../components/common/Miscellanea';
import Logo from '../../../components/common/Logo';
import { withAuthSync } from '../../../utils/auth';
import { Button, Input } from '../../../VuexyDesign/atoms/_index';
import { TextBolder22 } from '../../../VuexyDesign/atoms/Text';

const ResetPassFormPage: NextPage = () => {
  const router = useRouter();
  const { t } = useTranslation('profile');

  return (
    <ResetPasswordContainer>
      <VirppLogo width={190} />
      <TextBolder22>{t('profile:resetYourPassword') as string}</TextBolder22>
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

            <Input
              className="text-dark"
              type="email"
              name="email"
              placeholder={t('profile:yourEmail') as string}
            />
            <ErrorMessage name="password" component={ErrorLabel} />
            <Input
              className="text-dark"
              type="password"
              name="password"
              placeholder={t('profile:fillInNewPassword') as string}
            />
            <ErrorMessage name="password_confirmation" component={ErrorLabel} />
            <Input
              className="text-dark"
              type="password"
              name="password_confirmation"
              placeholder={t('profile:confirmNewPassword') as string}
            />
            <Button
              disabled={isSubmitting}
              type="submit"
              color="primary"
              className="w-100"
            >
              {t('profile:submit') as string}
            </Button>
          </Form>
        )}
      </Formik>
    </ResetPasswordContainer>
  );
};

const ResetPasswordContainer = styled(CustomContainer)`
  max-width: 565px;
`;
const VirppLogo = styled(Logo)`
  padding: 30px 0;
  margin-bottom: 30px;
`;
export default withAuthSync(ResetPassFormPage);
