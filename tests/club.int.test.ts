import request from "supertest";
import app from "../src/app"
import { JSONDatabase } from '../src/database/JSONDatabase';
import { createMockFs, restoreFsMocks } from './helpers/mockFsHelper';

const ClubsAndCountries: string = '{"id": 0, "name": "Real Madrid", "country": "Espanha" },' +
'{"id": 1, "name": "Manchester City", "country": "Inglaterra" },' +
'{"id": 2, "name": "Bayern de Munique", "country": "Alemanha" },' +
'{"id": 3, "name": "Paris Saint-Germain", "country": "França" },' +
'{"id": 4, "name": "Liverpool", "country": "Inglaterra" },' +
'{"id": 5, "name": "Inter de Milão", "country": "Itália" },' +
'{"id": 6, "name": "Borussia Dortmund", "country": "Alemanha" },' +
'{"id": 7, "name": "Arsenal", "country": "Inglaterra" }';

describe("API: Routes Clubs - integration",()=>{
  let mockFs: ReturnType<typeof createMockFs>;
      beforeEach(async ()=>{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (JSONDatabase as any).instance = undefined;
        mockFs = createMockFs(`{"clubs": {"data":[${ClubsAndCountries}],"count": 8}}`, true);
        jest.clearAllMocks();
      })

      afterEach(() => {
        restoreFsMocks();
      });
        
      it('GET /api/v1/clubs returns array', async () => {
        const res = await request(app).get('/api/v1/clubs');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toHaveLength(8);
      })

      it('GET /api/v1/clubs/:id returns object', async () => {
        const res = await request(app).get('/api/v1/clubs/2');
        expect(res.status).toBe(200);
        expect(Object.keys(res.body)).toHaveLength(3);
        expect(mockFs.readFile).toHaveBeenCalledTimes(1)
        expect(Object.hasOwn(res.body, "name")).toBeTruthy();
        expect(Object.hasOwn(res.body, "country")).toBeTruthy();
        expect(res.body["name"]).toBe("Bayern de Munique");
      })

      it("GET /api/v1/clubs/:id exception: invalid ID (only numbers)", async ()=>{
        const res = await request(app).get('/api/v1/clubs/pa');
        expect(res.status).toBe(400);
        expect(mockFs.readFile).toHaveBeenCalledTimes(0)
        expect(Object.hasOwn(res.body, "error")).toBeTruthy();
        expect(res.body["error"]).toEqual<string>("ID information is not valid");
      })

      it("GET /api/v1/clubs/:id exception: invalid ID (not negative numbers)", async ()=>{
        const res = await request(app).get('/api/v1/clubs/-1');
        expect(res.status).toBe(400);
        expect(mockFs.readFile).toHaveBeenCalledTimes(0)
        expect(Object.hasOwn(res.body, "error")).toBeTruthy();
        expect(res.body["error"]).toEqual<string>("ID information is not valid");
      })
      
      it("GET /api/v1/clubs/:id exception: recurse not found.", async ()=>{
        const res = await request(app).get('/api/v1/clubs/12');
        expect(res.status).toBe(404);
        expect(mockFs.readFile).toHaveBeenCalledTimes(1)
        expect(Object.hasOwn(res.body, "error")).toBeTruthy();
        expect(res.body["error"]).toEqual<string>("Club not found");
      })
      
});

describe("API: Principal routes - integration", ()=>{
  it('GET /health', async () => {
    const res = await request(app).get("/api/v1/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  })
});