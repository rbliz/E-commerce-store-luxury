import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FieldValues, useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useAppDispatch } from '../../app/store/configureStore';
import { signInUser } from './accountSlice';



// TODO remove, this demo shouldn't need to reset the theme.

const theme= createTheme({
    palette:{
     background: {
       default: '#161a1d'
     }
    }
   })
 

export default function Login() {
  // creating a controlled form so that react can manage form state. 

  //using the react hook form package
  const {register, handleSubmit, formState: {isSubmitting, errors, isValid}} = useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

 async function submitForm(data: FieldValues){
    try{
      await dispatch(signInUser(data));
      navigate(location.state?.from || '/catalog');
    }catch(error){
      console.log(error)
    }
 }

  return (
    <ThemeProvider theme={theme}>
      <Grid container component={Paper}  sx={{ height: '75vh', mb: 4, mt: '130px'}}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1443884590026-2e4d21aee71c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTgwfHxsdXh1cnklMjBzdG9yZXxlbnwwfDB8MHx8fDA%3D)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item sx={{bgcolor: '#fffaff', color: 'black'}} xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit(submitForm)} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                fullWidth
                label="Username"
                {...register('username', {required: 'Username is required'})}
                error={!!errors.username} // this casts the username to a boolean
                helperText={errors?.username?.message as string}
                autoFocus
                InputLabelProps={{sx:{color: 'black'}}}
                inputProps={{style:{color:'black'}}}
                sx={{border: '0.5px solid black'}}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Password"
                type="password"
                {...register('password', {required: 'Password is required'})}
                error={!!errors.password}
                helperText={errors?.password?.message as string}
                InputLabelProps={{sx:{color: 'black'}}}
                inputProps={{style:{color:'black'}}}
                sx={{border: '0.5px solid black'}}
              />
              {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
              <LoadingButton
                disabled={!isValid}
                loading={isSubmitting}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2}}
              >
                Sign In
              </LoadingButton>
              <Grid container>
                <Grid item xs>
                  {/* <Link href="#" variant="body2">
                    Forgot password?
                  </Link> */}
                </Grid>
                <Grid item>
                  <Link to="/register">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}