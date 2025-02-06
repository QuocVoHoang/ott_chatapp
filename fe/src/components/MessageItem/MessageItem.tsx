import { RootState } from "@/lib/redux/store"
import { Avatar, Box } from "@mui/material"
import { useSelector } from "react-redux"

export default function MessageItem({
  message, isShowPicture,
}: {message: IMessage, isShowPicture: boolean}){
  const user = useSelector((state: RootState) => state.user)
  return(
    <Box
      sx={{
        width: "100%",
        marginTop: "5px",
        display: "flex",
        flexDirection: message.sender === user.userUid ? "row-reverse" : "row"
      }}
    >
      <Box
        sx={{
          marginTop: "5px",
          width: "40px"
        }}
      >
        {isShowPicture && <Avatar alt="Remy Sharp" src={user.userPhotoUrl}/>}
      </Box>
      <Box
        sx={{
          maxWidth: "45%",
          marginX: "5px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "5px",
        }}
      >
        <Box
          sx={{
            fontWeight: "500"
          }}
        >
          {message.sender}
        </Box>
        <Box
          sx={{
            wordBreak: "break-word"
          }}
        >
          {message.content}
        </Box>
      </Box>
      
    </Box>
  )
}