from django.urls import path
from .views import (
    CollectionCenterListView,
    IncomingProduceQueueView,
    ReceiveProduceView,
    QualityCheckCreateView,
    ProduceBatchListView
)

urlpatterns = [
    path('centers/', CollectionCenterListView.as_view(), name='collection-center-list'),
    path('incoming/', IncomingProduceQueueView.as_view(), name='collection-incoming'),
    path('receive/', ReceiveProduceView.as_view(), name='collection-receive'),
    path('quality-check/', QualityCheckCreateView.as_view(), name='collection-quality-check'),
    path('batches/', ProduceBatchListView.as_view(), name='collection-batches'),
]
