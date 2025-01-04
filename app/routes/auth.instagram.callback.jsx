import {redirect, json} from '@remix-run/node';
import axios from "axios";
import qs from 'qs';



export const loader = async ({request, session})=>{
  const url = new URL(request.url);
  console.log(request.url);
  const code = url.searchParams.get('code');

  if (!code){
    return redirect('/app');
  }

  try {

    const requestData = qs.stringify({
      client_id: "1990577728109053",
      client_secret: "33f126ed6da9cf78907abb35ca28c22e",
      grant_type: "authorization_code",
      redirect_uri: "https://alaska-qualification-director-medicaid.trycloudflare.com/auth/instagram/callback",
      code,
    })

    const response = await axios.post("https://api.instagram.com/oauth/access_token", requestData, {
      headers:{
        "Content-Type":"application/x-www-form-urlencoded"
      }
    });

    // Save access token and user details (to session or database)

    const { access_token, user_id } = await response.data;

    const userResponse = await fetch(`https://graph.instagram.com/v21.0/${user_id}?fields=id,username&access_token=${access_token}`);

    console.log("User Details:", userResponse.data);
    // long live access token

    const longRequestData = qs.stringify({
      grant_type: "ig_exchange_token",
      client_secret: "33f126ed6da9cf78907abb35ca28c22e",
      access_token,
    });

    const lResponse = await axios.get(`https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=33f126ed6da9cf78907abb35ca28c22e&access_token=${access_token}`)


    // const longResponse = await axios.post("https://graph.instagram.com/access_token", longRequestData, {
    //   headers:{
    //     "Content-Type":"application/x-www-form-urlencoded"
    //   }
    // });

    console.log("Long Access Token:", lResponse.data);


    const fields = 'user_id, username';


    // const profileResponse = await axios.get(`https://graph.instagram.com/me?fields=username&access_token=${access_token}`);
    // const profileResponse =  await axios.get(`https://graph.instagram.com/me/${user_id}/media?access_token=${access_token}`);
    // const profileResponse = await axios.get(`https://graph.instagram.com/v21.0/17841471697332555/media?access_token=${access_token}`);
    // console.log('Profile Response: ', profileResponse.data);


    // Example: Redirect to your app or return data
    return json({
      success: true,
      access_token,
      user_id,
    });
  } catch (error) {
    console.error("Error exchanging code for token:", error.response?.data || error.message);
    return json({ error: "Failed to exchange authorization code" }, { status: 500 });
  }

}


