# 🐳 Docker Compose - Guide dla Frontend Developera

## Szybki Start

### Wymagania
- Docker Desktop zainstalowany i uruchomiony
- Plik `.env` w głównym katalogu projektu z `NEXT_PUBLIC_API_URL`

### Podstawowe Komendy

#### 1. Budowanie i Uruchamianie
```bash
# Zbuduj i uruchom tylko frontend
docker-compose --profile frontend up --build

# Zbuduj bez cache (przydatne przy problemach)
docker-compose --profile frontend build --no-cache

# Uruchom w tle (detached mode)
docker-compose --profile frontend up -d
```

#### 2. Zatrzymywanie
```bash
# Zatrzymaj kontenery (zachowuje dane)
docker-compose --profile frontend stop

# Zatrzymaj i usuń kontenery
docker-compose --profile frontend down

# Zatrzymaj i usuń kontenery + wolumeny + obrazy
docker-compose --profile frontend down -v --rmi all
```

#### 3. Podgląd Logów
```bash
# Pokaż logi z frontendu
docker-compose logs frontend

# Logi na żywo (follow)
docker-compose logs -f frontend

# Ostatnie 50 linii
docker-compose logs --tail=50 frontend
```

#### 4. Status Kontenerów
```bash
# Pokaż działające kontenery
docker-compose ps

# Sprawdź health check
docker ps
```

## Profile Docker Compose

Projekt używa profilów do uruchamiania różnych części aplikacji:

| Profil | Opis | Komenda |
|--------|------|---------|
| `frontend` | Tylko aplikacja Next.js | `docker-compose --profile frontend up` |
| `backend` | Wszystkie serwisy backendowe | `docker-compose --profile backend up` |
| `all` | Całość (frontend + backend) | `docker-compose --profile all up` |

### Przykłady Użycia Profilów

```bash
# Tylko frontend (do developmentu frontendowego)
docker-compose --profile frontend up -d

# Cały stack (frontend + backend)
docker-compose --profile all up -d

# Tylko backend (gdy frontend develokujesz lokalnie)
docker-compose --profile backend up -d
```

## Praca z Kontenerami

### Wejście do Kontenera
```bash
# Otwórz shell w działającym kontenerze
docker exec -it student-helper-frontend sh

# Uruchom komendę w kontenerze
docker exec student-helper-frontend ls -la
```

### Restart Kontenera
```bash
# Restart pojedynczego serwisu
docker-compose restart frontend

# Rebuild i restart
docker-compose up -d --build frontend
```

### Rebuild po Zmianach w Kodzie
```bash
# Szybki rebuild
docker-compose build frontend
docker-compose up -d frontend

# Lub w jednej komendzie
docker-compose up -d --build frontend
```

## Konfiguracja

### Zmienne Środowiskowe

Plik `.env` w głównym katalogu:
```env
NEXT_PUBLIC_API_URL=http://localhost:4001
# Dodaj inne zmienne...
```

**Ważne:** Po zmianie zmiennych środowiskowych musisz przebudować obraz!

```bash
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

### Porty

| Serwis | Port | Dostęp |
|--------|------|--------|
| Frontend | 3000 | http://localhost:3000 |
| API Gateway | 4001 | http://localhost:4001 |
| CDN Service | 3001 | http://localhost:3001 |

## Rozwiązywanie Problemów

### Container nie startuje
```bash
# Sprawdź logi
docker-compose logs frontend

# Sprawdź czy port nie jest zajęty
netstat -ano | findstr :3000

# Usuń stare kontenery i spróbuj ponownie
docker-compose down
docker-compose up --build frontend
```

### Zmiany w kodzie nie są widoczne
```bash
# Przebuduj bez cache
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

### Problemy z pamięcią
```bash
# Wyczyść niewykorzystane obrazy i kontenery
docker system prune -a

# Wyczyść cache buildu
docker builder prune -a
```

### Health Check nie przechodzi
```bash
# Sprawdź endpoint
curl http://localhost:3000/api/health

# Sprawdź logi health checka
docker inspect student-helper-frontend | grep -A 10 Health
```

## Workflow Deweloperski

### Opcja 1: Full Docker (rekomendowane dla spójności)
```bash
# Uruchom wszystko w Dockerze
docker-compose --profile all up -d

# Oglądaj logi
docker-compose logs -f frontend

# Po zmianach w kodzie
docker-compose up -d --build frontend
```

### Opcja 2: Backend w Docker, Frontend lokalnie
```bash
# Uruchom tylko backend
docker-compose --profile backend up -d

# W osobnym terminalu - frontend lokalnie
npm run dev
```

### Opcja 3: Tylko Frontend w Docker
```bash
# Jeśli backend jest gdzie indziej lub mockujesz API
docker-compose --profile frontend up -d
```

## Przydatne One-liners

```bash
# Zatrzymaj wszystko i wyczyść
docker-compose down -v && docker system prune -f

# Sprawdź rozmiar obrazów
docker images | grep student-helper

# Sprawdź zużycie zasobów
docker stats

# Zobacz wszystkie kontenery (nawet zatrzymane)
docker ps -a

# Usuń wszystkie zatrzymane kontenery
docker container prune

# Export logów do pliku
docker-compose logs frontend > frontend-logs.txt
```

## Production Build

```bash
# Build produkcyjny
docker-compose build frontend

# Tag obrazu
docker tag student-helper-frontend:latest mionmu/student-helper-frontend:v1.0.0

# Push do registry (opcjonalnie)
docker push mionmu/student-helper-frontend:v1.0.0
```

## Monitoring

### Sprawdź Health Status
```bash
# Wszystkie kontenery
docker ps --format "table {{.Names}}\t{{.Status}}"

# Szczegóły health checka
docker inspect --format='{{json .State.Health}}' student-helper-frontend | jq
```

### Zużycie Zasobów
```bash
# Live monitoring
docker stats student-helper-frontend

# Limity zasobów (zgodnie z docker-compose.yml)
# CPU: 0.1 core (10%)
# RAM: 512MB limit, 256MB reserved
```

## FAQ

**Q: Czy muszę restartować kontener po każdej zmianie w kodzie?**  
A: Tak, w trybie produkcyjnym (Docker). Do developmentu lepiej użyć `npm run dev` lokalnie.

**Q: Jak działa hot reload?**  
A: W kontenerze produkcyjnym nie ma hot reload. Musisz przebudować obraz. Do developmentu użyj lokalnego `npm run dev`.

**Q: Dlaczego build trwa tak długo?**  
A: Next.js robi production build. Użyj cache'a: `docker-compose build frontend` (bez `--no-cache`).

**Q: Jak podłączyć debugger?**  
A: W kontenerze produkcyjnym to trudne. Develokuј lokalnie z `npm run dev`.

**Q: Co zrobić gdy kontener ciągle się restartuje?**  
A: Sprawdź logi (`docker-compose logs frontend`) i health check endpoint.

## Dodatkowe Zasoby

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [Multi-stage Docker Builds](https://docs.docker.com/build/building/multi-stage/)

---

**Pro tip:** Dodaj alias do `.bashrc` lub `.zshrc`:
```bash
alias dc='docker-compose'
alias dcup='docker-compose --profile frontend up -d'
alias dcdown='docker-compose down'
alias dclogs='docker-compose logs -f'
```
