export const formatDate = (isoString: string) => {
    const date = new Date(isoString);
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours() + 9).padStart(2, "0"); // UTC를 KST로 변환
    const minutes = String(date.getMinutes()).padStart(2, "0");
  
   const adjustedHours = parseInt(hours, 10);
   if (adjustedHours >= 24) {
     return `${year}.${month}.${String(parseInt(day, 10) + 1).padStart(
       2,
       "0"
     )} ${String(adjustedHours - 24).padStart(2, "0")}:${minutes}`;
  }
  
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  }