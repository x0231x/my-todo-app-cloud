#from django.shortcuts import render

# Create your views here.

# 匯入 DRF 的 viewsets
from rest_framework import viewsets
# 匯入剛剛定義的模型與序列化器
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    """
    ModelViewSet 幫你自動產生 list、retrieve、create、update、partial_update、destroy 這六種動作
    對應到 /api/tasks/ 與 /api/tasks/<id>/ 的 CRUD 操作
    """
    # 指定要操作的 queryset
    queryset = Task.objects.order_by('-created')
    # 告訴它要用哪個 Serializer 來處理輸入與輸出
    serializer_class = TaskSerializer