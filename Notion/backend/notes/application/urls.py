from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NoteViewSet, TagViewSet, FolderViewSet, NoteRevisionViewSet, NoteCaptureViewSet, TagRelationshipViewSet, TagCategoryViewSet

# Initialize the router and register viewsets
router = DefaultRouter()
router.register(r'notes', NoteViewSet)
router.register(r'tags', TagViewSet)
router.register(r'folders', FolderViewSet)
router.register(r'revisions', NoteRevisionViewSet)
router.register(r'captures', NoteCaptureViewSet)
router.register(r'tag-relationships', TagRelationshipViewSet)
router.register(r'tag-categories', TagCategoryViewSet)  # Added TagCategoryViewSet

# Define URL patterns
urlpatterns = [
    path('', include(router.urls)),
]

# Custom actions for additional endpoints
urlpatterns += [
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),

    path('notes/<int:pk>/revisions/', NoteViewSet.as_view({'get': 'revisions'}), name='note-revisions'),
    path('notes/<int:pk>/restore-revision/', NoteViewSet.as_view({'post': 'restore_revision'}), name='note-restore-revision'),
    path('tags/<int:pk>/related-tags/', TagViewSet.as_view({'get': 'related_tags'}), name='tag-related-tags'),
    path('tags/suggest/', TagViewSet.as_view({'get': 'suggest_tags'}), name='tag-suggest'),  # Added tag suggestions
    path('notes/search/', NoteViewSet.as_view({'get': 'search_notes'}), name='note-search')  # Added search endpoint
]
