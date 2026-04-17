import { jest, describe, test, expect, beforeEach } from '@jest/globals';

jest.mock('mariadb', () => ({
  createPool: jest.fn(() => ({
    getConnection: jest.fn()
  }))
}));

// 2. Imports
import { CommentService } from '../server/services/CommentService';
import { Database } from '../server/database/database';


jest.mock('../server/database/database', () => {
  return {
    Database: jest.fn().mockImplementation(() => {
      return {
        executeSQL: jest.fn() 
      };
    })
  };
});

describe('CommentService (MiniTwitter)', () => {
  let commentService: CommentService;
  let mockExecuteSQL: any;

  beforeEach(() => {
    jest.clearAllMocks();
    commentService = new CommentService();
    

    mockExecuteSQL = (commentService as any).database.executeSQL;

    mockExecuteSQL.mockResolvedValue([]);
  });

  describe('Erstellen von Kommentaren', () => {
    test('TC-C01: sollte einen gültigen Kommentar erstellen', async () => {
      const input = { content: 'Test Kommentar', authorId: 1, postId: 10 };
      const result = await commentService.createComment(input);
      
      expect(result.content).toBe('Test Kommentar');
      expect(mockExecuteSQL).toHaveBeenCalled();
    });

    test('TC-C02: sollte Fehler werfen wenn der Inhalt leer ist', async () => {
      const input = { content: '  ', authorId: 1, postId: 10 };
      await expect(commentService.createComment(input))
        .rejects.toThrow('Kommentar darf nicht leer sein');
    });
  });

  describe('Löschen & Rollenmanagement', () => {
    test('TC-R01: ADMIN darf fremde Kommentare löschen', async () => {

      mockExecuteSQL.mockResolvedValueOnce([{ id: 5, authorId: 99, postId: 10 }]);

      await expect(commentService.deleteComment(5, 1, 'ADMIN')).resolves.not.toThrow();
    });

    test('TC-R02: Normaler User darf fremde Kommentare NICHT löschen', async () => {

      mockExecuteSQL.mockResolvedValueOnce([{ id: 5, authorId: 99, postId: 10 }]);

      await expect(commentService.deleteComment(5, 1, 'USER'))
        .rejects.toThrow('Keine Berechtigung zum Löschen dieses Kommentars');
    });
  });
});
