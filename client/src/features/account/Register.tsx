import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import agent from '../../app/api/agent';
import { toast } from 'react-toastify';



// TODO remove, this demo shouldn't need to reset the theme.

const theme= createTheme({
    palette:{
     background: {
       default: '#0b090a'
     }
    }
   })
 

export default function Register() {
    const {register, handleSubmit, setError, formState: {isSubmitting, errors, isValid}} = useForm();
    const navigate = useNavigate();

    function handleApiErrors(errors: any){
        if(errors){
            errors.forEach((error: string) => {
                if(error.includes('Password')){
                    setError('password', {message: error})
                }else if(error.includes('Email')){
                    setError('email', {message: error})
                }else if(error.includes('Username')){
                    setError('username', {message: error})
                }
            })
        }
    }

return (
    <ThemeProvider theme={theme}>
      <Grid container component={Paper}  sx={{ height: '100vh', mb: 4}}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1551298213-de5c034f5d50?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODN8fGx1eHVyeXxlbnwwfHwwfHx8MA%3D%3D)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item sx={{bgcolor: '#161a1d', color: '#fffaff'}} xs={12} sm={8} md={5} component={Paper} elevation={6} square>
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
              Registration
            </Typography>
            <Box component="form" 
                onSubmit={handleSubmit(data => agent.Account.register(data)
                    .then(() => {
                        toast.success('Registration successful')
                        navigate('/login')
                    })
                    .catch(error => handleApiErrors(error)))} 
                    noValidate 
                    sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                fullWidth
                label="Username"
                {...register('username', {required: 'Username is required'})}
                error={!!errors.username} // this casts the username to a boolean
                helperText={errors?.username?.message as string}
                autoFocus
                InputLabelProps={{sx:{color: '#fffaff'}}}
                inputProps={{style:{color:'#fffaff'}}}
                sx={{border: '0.5px solid #fffaff'}}
              />
               <TextField
                margin="normal"
                fullWidth
                label="Email"
                {...register('email', {
                    required: 'Email is required',
                    pattern: {
                        value: /^\w+[\w-.]*@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/,
                        message: 'Not a valid email address'
                    }
                })}
                error={!!errors.email} // this casts the username to a boolean
                helperText={errors?.email?.message as string}
                InputLabelProps={{sx:{color: '#fffaff'}}}
                inputProps={{style:{color:'#fffaff'}}}
                sx={{border: '0.5px solid #fffaff'}}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Password"
                type="password"
                {...register('password', {
                    required: 'Password is required',
                    pattern: {
                        value: /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
                        message: 'Password does not meet complexity requirements'
                    }
                })}
                error={!!errors.password}
                helperText={errors?.password?.message as string}
                InputLabelProps={{sx:{color: '#fffaff'}}}
                inputProps={{style:{color:'#fffaff'}}}
                sx={{border: '0.5px solid #fffaff'}}
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
                Register
              </LoadingButton>
              <Grid container>
                <Grid item xs>
                  {/* <Link href="#" variant="body2">
                    Forgot password?
                  </Link> */}
                </Grid>
                <Grid item>
                  <Link to="/login">
                    {"Already have an account? Sign In"}
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