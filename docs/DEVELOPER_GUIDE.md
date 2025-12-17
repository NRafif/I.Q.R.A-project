# Developer Guide

## Onboarding

Selamat datang di project I.Q.R.A! Guide ini akan membantu Anda memahami codebase dan mulai berkontribusi.

## Prerequisites

Sebelum mulai, pastikan Anda sudah:
- ✅ Membaca [README.md](../README.md)
- ✅ Membaca [ARCHITECTURE.md](./ARCHITECTURE.md)
- ✅ Membaca [CODE_STYLE.md](./CODE_STYLE.md)
- ✅ Setup development environment

## Project Structure

```
IQRA-Project/
├── website/              # Next.js application
│   ├── src/
│   │   ├── app/         # Pages (App Router)
│   │   ├── components/  # React components
│   │   └── lib/         # Utilities
│   └── public/          # Static assets
├── qr-generator/        # Python QR generator
├── docs/                 # Documentation
└── file/                # Project files
```

## Development Workflow

### 1. Setup

```bash
# Clone repository
git clone <repo-url>
cd IQRA-Project

# Install dependencies
cd website
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local dengan URL production
```

### 2. Development

```bash
# Start dev server
npm run dev

# Run tests
npm run test

# Lint code
npm run lint
```

### 3. Adding New Tree

1. Edit `website/public/data/trees.json`
2. Tambahkan tree object dengan struktur yang valid
3. Test dengan `npm run dev`
4. Generate QR code: `cd ../qr-generator && python generate_qr.py`

## Code Standards

### Naming Conventions

- **Components**: PascalCase (`TreeDetailPage`)
- **Functions**: camelCase (`loadTreesData`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_TREE_ID`)
- **Files**: kebab-case (`tree-detail-page.js`)

### Comments

```javascript
/**
 * Mengapa function ini diperlukan?
 * - Explain the "why", not the "what"
 * - Document complex logic
 * - Note important decisions
 */
function complexFunction() {
  // Implementation
}
```

### Error Handling

```javascript
try {
  // Operation
} catch (error) {
  // Log untuk debugging
  console.error('Context:', error)
  // Return safe default
  return null
}
```

## Testing

### Running Tests

```bash
# All tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### Writing Tests

```javascript
describe('FunctionName', () => {
  it('should handle valid input', () => {
    // Arrange
    const input = 'valid'
    
    // Act
    const result = functionName(input)
    
    // Assert
    expect(result).toBe(expected)
  })
  
  it('should reject invalid input', () => {
    expect(functionName('invalid')).toBeNull()
  })
})
```

## Security Checklist

Sebelum commit, pastikan:

- [ ] Semua user input divalidasi
- [ ] Tidak ada hardcoded secrets
- [ ] Error messages tidak expose sensitive info
- [ ] File paths menggunakan path.join()
- [ ] URLs divalidasi sebelum digunakan

## Common Tasks

### Adding New Component

1. Create file di `website/src/components/`
2. Add JSDoc comments
3. Export component
4. Add tests di `__tests__/`
5. Update documentation jika perlu

### Modifying Data Structure

1. Update `trees.json`
2. Update `validateTreeData()` jika perlu
3. Update tests
4. Test semua pages yang menggunakan data

### Fixing Bugs

1. Reproduce bug
2. Write test untuk bug
3. Fix bug
4. Verify test passes
5. Update documentation jika perlu

## Debugging

### Common Issues

#### Hydration Mismatch
- Check untuk browser-only APIs di server render
- Gunakan `suppressHydrationWarning` jika diperlukan
- Use `mounted` state untuk conditional rendering

#### Data Not Loading
- Check network tab untuk fetch errors
- Verify JSON file structure
- Check console untuk error messages

#### Build Errors
- Check untuk missing dependencies
- Verify environment variables
- Check Next.js version compatibility

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Project Architecture](./ARCHITECTURE.md)
- [Security Guide](./SECURITY.md)
- [API Documentation](./API.md)

## Getting Help

Jika stuck:
1. Check documentation di `docs/`
2. Search existing issues
3. Ask team members
4. Create issue dengan detail lengkap

## Contributing

1. Create feature branch
2. Make changes dengan mengikuti code style
3. Write tests
4. Update documentation
5. Submit pull request

---

**Happy Coding! 🌳✨**

