import React from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../state/index.jsx'; // Adjust according to your state management
import Dropzone from 'react-dropzone';
import guestImage from '../../assets/guest.png';

// Reuse the same schema from your LoginForm for validation
const profileSchema = yup.object().shape({
  firstName: yup.string().required('required'),
  lastName: yup.string().required('required'),
  userName: yup.string().required('required'),
  email: yup.string().email('invalid email').required('required'),
  password: yup.string().required('required'),
  picture: yup.string().required('required'),
});

const EditProfile = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => {}) || {
    username: 'Guest',
    picture: guestImage,
  };

  // const user = useSelector((state) => state.auth.user) || {
  //   username: 'Guest',
  //   picture: guestImage,
  // };

  const isNonMobile = useMediaQuery('(min-width:600px)');

  const handleFormSubmit = async (values, { resetForm }) => {
    // Here you would handle updating the user information
    // Dispatch the updateUser action with the form values
    dispatch(
      updateUser({
        ...values,
        picturePath: values.picture.name,
      })
    );

    resetForm();
  };

  const initialValues = {
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    userName: user.username || 'Guest', // Default to 'Guest' if username is not set
    email: user.email || '',
    password: '', // Password should not be pre-filled
    picture: user.picture || guestImage,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={profileSchema}
      onSubmit={handleFormSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        isSubmitting,
      }) => (
        <Box
          width='100%'
          height='100vh'
          display='flex'
          alignItems='center'
          justifyContent='center'
          backgroundColor={'#E5D9D2'} // Light beige background
        >
          <Box
            width={isNonMobile ? '50%' : '90%'}
            p='2rem'
            my='2rem'
            mx='auto'
            borderRadius='1.5rem'
            backgroundColor={'#FFFFFF'} // You can keep this white or change to one of your theme colors if preferred
            boxShadow='0px 3px 15px rgba(0,0,0,0.2)'
            display='flex'
            flexDirection='column'
            alignItems='center'
          >
            <Typography
              fontWeight='500'
              variant='h4'
              sx={{ mb: '2rem', color: '#1F3528' }} // Dark green text
            >
              Edit Profile
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <Box
                display='grid'
                gap='20px'
                gridTemplateColumns='repeat(2, 1fr)'
                sx={{
                  maxWidth: '500px',
                  width: '100%',
                  margin: 'auto',
                }}
              >
                <TextField
                  label='First name'
                  name='firstName'
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  fullWidth
                />
                <TextField
                  label='Last name'
                  name='lastName'
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  fullWidth
                />
                <TextField
                  label='User name'
                  name='userName'
                  value={values.userName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.userName) && Boolean(errors.userName)}
                  helperText={touched.userName && errors.userName}
                  fullWidth
                />
                <TextField
                  label='Email'
                  name='email'
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  fullWidth
                />
                <TextField
                  label='Password'
                  name='password'
                  type='password'
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.password) && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  fullWidth
                />
                <Box gridColumn='span 2'>
                  <Dropzone
                    onDrop={(acceptedFiles) =>
                      setFieldValue('picture', acceptedFiles[0])
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border='1px dashed #ddd'
                        borderRadius='4px'
                        p='1rem'
                        textAlign='center'
                        sx={{ '&:hover': { cursor: 'pointer' } }}
                      >
                        <input {...getInputProps()} />
                        <Typography variant='body1'>
                          {!values.picture
                            ? 'Add picture here'
                            : values.picture.name}
                        </Typography>
                      </Box>
                    )}
                  </Dropzone>
                </Box>
              </Box>
              <Button
                type='submit'
                fullWidth
                disabled={isSubmitting}
                sx={{
                  mt: '2rem',
                  mb: '1rem',
                  p: '10px 0',
                  backgroundColor: '#1F3528', // Dark green button
                  color: '#AD8157', // Brownish hue text
                  '&:hover': {
                    backgroundColor: '#AD8157', // Brownish hue button on hover
                    color: '#E5D9D2', // Light beige text on hover
                  },
                  borderRadius: '20px',
                }}
              >
                Save Changes
              </Button>
            </form>
          </Box>
        </Box>
      )}
    </Formik>
  );
};

export default EditProfile;
