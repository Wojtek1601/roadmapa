import app from "./app";
import { config } from "./config";

app.listen(config.port, () => {
  console.log(`Serwer uruchomiony na porcie ${config.port}`);
});
