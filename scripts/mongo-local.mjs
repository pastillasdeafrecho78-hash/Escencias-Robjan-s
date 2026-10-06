import { mkdir } from "node:fs/promises";
import { createServer } from "node:net";
import { resolve } from "node:path";
import { MongoMemoryServer } from "mongodb-memory-server";

const dbPath = resolve(".mongo-local");
await mkdir(dbPath, { recursive: true });
const disponible = await new Promise((resolveDisponible) => {
  const prueba = createServer();
  prueba.once("error", () => resolveDisponible(false));
  prueba.listen(27017, "127.0.0.1", () => prueba.close(() => resolveDisponible(true)));
});
if (!disponible) {
  throw new Error("El puerto 27017 ya está ocupado. Usa el MongoDB existente o detén ese servicio antes de iniciar mongo:local.");
}
const servidor = await MongoMemoryServer.create({
  instance: { ip: "127.0.0.1", port: 27017, portGeneration: false, dbPath, storageEngine: "wiredTiger" },
});
console.log(`MongoDB local listo en ${servidor.getUri()} (datos persistentes en ${dbPath})`);
console.log("Cierra con Ctrl+C.");
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, async () => {
    await servidor.stop({ doCleanup: true, force: false });
    process.exit(0);
  });
}
