import request from "supertest";
import app from "../src/app"

describe("API: Routes Clubs - integration",()=>{
        
      it('GET /api/v1/clubs returns array', async () => {
        const res = await request(app).get('/api/v1/clubs');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
      })
});

describe("API: Principal routes - integration", ()=>{
  it('GET /health', async () => {
    const res = await request(app).get("/api/v1/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  })
});